import { useCallback, useMemo } from "react";

import type { ReactNode } from "react";

type ComboBoxItem = {
  id: string;
  label: string;
  value?: string;
  parentId?: string;
  groupId: string;
  isSelectable: boolean;
  hasChildren?: boolean;
  keywords?: string[];
  leading?: ReactNode;
};
// & RHFCommandItemProps;

type ComboBoxGroup = {
  id: string;
  label?: string;
  itemIds: string[];
};

type DataStructure = {
  groups: ComboBoxGroup[];
  items: ComboBoxItem[];
};

type Intake = {
  groups: ComboBoxGroup[];
  flatIds?: string[];
} & Indexes;

type LiteralStringKeys<T> = {
  [K in keyof T]: T[K] extends `${infer _}` ? K : never;
}[keyof T];

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type RestrictKeys<
  T extends string | string[],
  TShape,
  TMode extends boolean = true,
> = TMode extends true
  ? T extends LiteralStringKeys<TShape>
    ? T
    : never
  : T extends StringKeys<TShape>
    ? T
    : never;

type DataLifeCycle =
  | {
      data: DataStructure | Readonly<DataStructure>;
      precompute: true;
    }
  | { data: Intake; precompute: false };

type Indexes = {
  itemsById: Record<string, ComboBoxItem>;
  valueToItem: Record<string, ComboBoxItem>;
  childrenByParent: Record<string, string[]>;
  parentToDescendantValues: Record<string, string[]>;
  parentToDescendantTerms: Record<string, string[]>;
};

type Callbacks = {
  getSelectedLabel: (selectedValue: string) => string | undefined;
  getChildrenItems: (parentId: string) => ComboBoxItem[];
  getDescendantsKeywords: (parentId: string) => string[];
  isLeafSelected: (itemId: string, selectedValue: string) => boolean;
  isAnyDescendantSelected: (parentId: string, selectedValue: string) => boolean;
};

//
type UseCollapsibleComboReturnType = [
  ComboBoxGroup[],
  Record<string, ComboBoxItem>,
  (selectedValue: string) => string | undefined,
  (parentId: string) => ComboBoxItem[],
  (parentId: string) => string[],
  (itemId: string, selectedValue: string) => boolean,
  (parentId: string, selectedValue: string) => boolean,
];

type UseCollapsibleComboParams = {} & DataLifeCycle;

type UseCollapsibleComboType = (
  props: DataLifeCycle
) => UseCollapsibleComboReturnType;

const useCollapsibleCombo: UseCollapsibleComboType = ({ data, precompute }) => {
  const indexes: Indexes = useMemo(() => {
    //
    if (!precompute) return data;

    //
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
    for (const item of data.items) {
      if (item.value !== undefined && item.isSelectable) {
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
        terms.push(currentItem.label?.toLowerCase());
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
            terms.push(childItem.label?.toLowerCase());
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

  const getSelectedLabel = useCallback(
    (selectedValue: string): string | undefined => {
      return indexes.valueToItem[selectedValue]?.label;
    },
    [indexes.valueToItem]
  );

  const isAnyDescendantSelected = useCallback(
    (parentId: string, selectedValue: string): boolean => {
      const descValues = indexes.parentToDescendantValues[parentId];
      if (!descValues || descValues.length === 0) return false;

      return descValues.includes(selectedValue);
    },
    [indexes.parentToDescendantValues]
  );

  const isLeafSelected = useCallback(
    (itemId: string, selectedValue: string): boolean => {
      const item = indexes.itemsById[itemId];
      if (!item || item.hasChildren || !item.isSelectable || !item.value) {
        return false;
      }
      return item.value === selectedValue;
    },
    [indexes.itemsById]
  );

  const getChildrenItems = useCallback(
    (parentId: string): ComboBoxItem[] => {
      const childIds = indexes.childrenByParent[parentId] || [];
      return childIds
        .map((id) => indexes.itemsById[id])
        .filter((item): item is ComboBoxItem => item !== undefined);
    },
    [indexes.childrenByParent, indexes.itemsById]
  );

  const getDescendantsKeywords = useCallback(
    (parentId: string): string[] => {
      return indexes.parentToDescendantTerms[parentId] || [];
    },
    [indexes.parentToDescendantTerms]
  );

  const groups: ComboBoxGroup[] = useMemo(() => {
    if (!data.groups?.length) {
      if (!precompute) {
        return [
          { id: "n_parents", label: undefined, itemIds: data.flatIds || [] },
        ];
      }

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
    groups,
    indexes.itemsById,
    getSelectedLabel,
    getChildrenItems,
    getDescendantsKeywords,
    isAnyDescendantSelected,
    isLeafSelected,
  ];
};

type RHFCollapsibleComboBoxItem = ComboBoxItem;

export { useCollapsibleCombo };
export type {
  Callbacks,
  DataLifeCycle,
  Intake,
  RestrictKeys,
  RHFCollapsibleComboBoxItem,
  UseCollapsibleComboParams,
  UseCollapsibleComboType,
};
