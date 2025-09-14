import { useCallback, useMemo } from "react";

import type { ReactNode } from "react";

type ComboBoxItem = {
  id: string;
  label: string;
  value?: string;
  parentId?: string;
  groupId?: string;
  isSelectable: boolean;
  hasChildren?: boolean;
  keywords?: string[];
  leading?: ReactNode;
};
// & RHFCommandItemProps;

type ComboBoxGroup = {
  id: string;
  label: string | undefined;
  itemIds: string[];
};

type DataStructure = {
  groups?: ComboBoxGroup[];
  items: ComboBoxItem[];
};

type StringLiteralArrayKeys<T> = {
  [K in keyof T]: T[K] extends `${infer _}`[] ? K : never;
}[keyof T];

type StringArrayKeys<T> = {
  [K in keyof T]: T[K] extends string[] ? K : never;
}[keyof T];

type RestrictKeys<
  T extends string | string[],
  TShape,
  TMode extends boolean = true,
> = TMode extends true
  ? T extends StringLiteralArrayKeys<TShape>
    ? T
    : never
  : T extends StringArrayKeys<TShape>
    ? T
    : never;

type Intake = {
  groups: ComboBoxGroup[];
  flatIds?: string[];
} & Indexes;

type Indexes = {
  itemsById: Record<string, ComboBoxItem>;
  childrenByParent: Record<string, string[]>;
  valueToItem: Record<string, ComboBoxItem>;
  parentToDescendantValues: Record<string, string[]>;
  parentToDescendantTerms: Record<string, string[]>;
};

type Callbacks = {
  getSelectedLabels: (selectedValues: string[]) => string[] | undefined;
  getChildrenItems: (parentId: string) => ComboBoxItem[];
  getDescendantsKeywords: (parentId: string) => string[];
  isLeafSelected: (itemId: string, selectedValues: string[]) => boolean;
  isAnyDescendantSelected: (
    parentId: string,
    selectedValues: string[]
  ) => boolean;
};

type DataLifeCycle =
  | {
      data: DataStructure | Readonly<DataStructure>;
      precompute: true;
    }
  | { data: Intake; precompute: false };

type UseMultiCollapsibleComboParams = {} & DataLifeCycle;

type UseMultiCollapsibleComboReturnType = [
  {
    groups: ComboBoxGroup[];
    items: Record<string, ComboBoxItem>;
  },
  {
    getSelectedLabels: (selectedValues: string[]) => string[] | undefined;
    getChildrenItems: (parentId: string) => ComboBoxItem[];
    getDescendantsKeywords: (parentId: string) => string[];
  },
  {
    isLeafSelected: (itemId: string, selectedValues: string[]) => boolean;
    isAnyDescendantSelected: (
      parentId: string,
      selectedValues: string[]
    ) => boolean;
  },
];

type UseMultiCollapsibleComboType = (
  params: UseMultiCollapsibleComboParams
) => UseMultiCollapsibleComboReturnType;

const useMultiCollapsibleCombo: UseMultiCollapsibleComboType = ({
  data,
  precompute,
}) => {
  //
  const indexes = useMemo(() => {
    if (!precompute) return data;

    const itemsById: Record<string, ComboBoxItem> = {};
    for (const item of data.items) {
      itemsById[item.id] = item;
    }

    const childrenByParent: Record<string, string[]> = {};
    for (const item of data.items) {
      if (item.parentId) {
        childrenByParent[item.parentId] = childrenByParent[item.parentId] || [];
        childrenByParent[item.parentId]?.push(item.id);
      }
    }

    const valueToItem: Record<string, ComboBoxItem> = {};
    const items = data.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item?.value !== undefined && item.isSelectable) {
        valueToItem[item.value] = item;
      }
    }

    const parentToDescendantValues: Record<string, string[]> = {};
    function getDescendantValues(
      id: string,
      visited: Set<string> = new Set()
    ): string[] {
      if (parentToDescendantValues[id]) {
        return parentToDescendantValues[id];
      }

      const desc: string[] = [];
      visited.add(id);

      const children = childrenByParent[id] || [];

      for (const childId of children) {
        if (visited.has(childId)) continue;

        const childItem = itemsById[childId];

        if (childItem) {
          if (childItem.isSelectable && childItem.value) {
            desc.push(childItem.value);
          }

          if (childItem.hasChildren) {
            const childDesc = getDescendantValues(childId, new Set(visited));
            desc.push(...childDesc);
          }
        }
      }

      parentToDescendantValues[id] = desc;
      return desc;
    }

    const parentToDescendantTerms: Record<string, string[]> = {};
    function getDescendantTerms(
      id: string,
      visited: Set<string> = new Set()
    ): string[] {
      if (parentToDescendantTerms[id]) {
        return parentToDescendantTerms[id];
      }

      const terms: string[] = [];
      visited.add(id);

      const currentItem = itemsById[id];
      if (currentItem) {
        terms.push(currentItem.label);
        if (currentItem.value) {
          terms.push(currentItem.value);
        }
        if (currentItem.keywords) {
          terms.push(...currentItem.keywords);
        }

        const children = childrenByParent[id] || [];
        for (const childId of children) {
          if (visited.has(childId)) continue;
          const childItem = itemsById[childId];
          if (childItem) {
            terms.push(childItem.label);
            if (childItem.value) {
              terms.push(childItem.value);
            }
            if (childItem.keywords) {
              terms.push(...childItem.keywords);
            }
            if (childItem.hasChildren) {
              const childTerms = getDescendantTerms(childId, new Set(visited));
              terms.push(...childTerms);
            }
          }
        }
      }

      parentToDescendantTerms[id] = terms;
      return terms;
    }

    for (const item of data.items) {
      if (item.hasChildren) {
        getDescendantValues(item.id);
      }

      getDescendantTerms(item.id);
    }

    return {
      itemsById,
      childrenByParent,
      valueToItem,
      parentToDescendantValues,
      parentToDescendantTerms,
    };
  }, [data, precompute]);

  //
  const getSelectedLabels = useCallback(
    (selectedValues: string[]): string[] => {
      if (!Array.isArray(selectedValues) || !selectedValues.length) return [];

      return selectedValues
        .map((val) => indexes.valueToItem?.[val]?.label)
        .filter((label) => label !== undefined) as string[];
    },
    [indexes.valueToItem]
  );

  // 2.
  const isAnyDescendantSelected = useCallback(
    (parentId: string, selectedValues: string[]): boolean => {
      const descValues = indexes.parentToDescendantValues[parentId];

      if (!descValues || descValues.length === 0) return false;

      const selectedSet = new Set(selectedValues);
      for (const val of descValues) {
        if (selectedSet.has(val)) return true;
      }
      return false;
    },
    [indexes.parentToDescendantValues]
  );

  const getChildrenItems = useCallback(
    (parentId: string): ComboBoxItem[] => {
      const childIds = indexes.childrenByParent[parentId] || [];
      return childIds
        .map((id) => indexes.itemsById[id])
        .filter((item) => item !== undefined);
    },
    [indexes.childrenByParent, indexes.itemsById]
  );

  //
  const isLeafSelected = useCallback(
    (itemId: string, selectedValues: string[]): boolean => {
      const item = indexes.itemsById[itemId];

      if (!item || item.hasChildren || !item.isSelectable || !item.value) {
        return false;
      }

      const selectedSet = new Set(selectedValues);

      return selectedSet.has(item.value);
    },
    [indexes.itemsById]
  );

  const getDescendantsKeywords = useCallback(
    (parentId: string): string[] => {
      return indexes.parentToDescendantTerms[parentId] || [];
    },
    [indexes.parentToDescendantTerms]
  );

  const groups: ComboBoxGroup[] = useMemo(() => {
    if (!data.groups?.length) {
      //
      if (!precompute) {
        return [
          { id: "n_parents", label: undefined, itemIds: data.flatIds || [] },
        ];
      }

      // precompute [true]
      const length = data.items.length;
      const itemIds = new Array(length);
      for (let i = 0; i < length; i++) {
        itemIds[i] = data.items[i]?.id as string;
      }

      return [{ id: "n_parents", label: undefined, itemIds }];
    }

    return data.groups;
  }, [data, precompute]);

  return [
    {
      groups,
      items: indexes.itemsById,
    },
    { getChildrenItems, getDescendantsKeywords, getSelectedLabels },
    {
      isAnyDescendantSelected,
      isLeafSelected,
    },
  ];
};
type RHFMultiCollapsibleComboBoxItem = ComboBoxItem;

export { useMultiCollapsibleCombo };
export type {
  Callbacks,
  DataLifeCycle,
  RestrictKeys,
  RHFMultiCollapsibleComboBoxItem,
  UseMultiCollapsibleComboParams,
  UseMultiCollapsibleComboType,
};
