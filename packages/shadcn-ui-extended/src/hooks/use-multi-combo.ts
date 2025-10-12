import { useCallback, useMemo } from "react";

import type { ReactNode } from "react";
import type { FieldError } from "react-hook-form";

type ComboBoxItem = {
  id: string;
  label: string;
  value: string;
  groupId?: string;
  isSelectable?: boolean;
  keywords?: string[];
  leading?: ReactNode;
};
// & RHFCommandItemProps;

type ComboBoxGroup = {
  id: string;
  label?: string;
  items: ComboBoxItem[] | ReadonlyArray<ComboBoxItem>;
};

type Indexes = {
  labelsByValue: Record<string, string>;
};

type Intake = {} & Indexes;

type DataLifeCycle = { data: ComboBoxGroup[] | Readonly<ComboBoxGroup[]> } & (
  | {
      precompute: true;
    }
  | {
      indexes: Intake;
      precompute: false;
    }
);

// type UseMultiComboBoxParams = {  };

type UseMultiComboReturnType = [
  (selectedValues: string[]) => string[],
  (value: string, selectedValues: string[]) => string[],
  (value: string, selectedValues: string[]) => boolean,
  (error: FieldError | undefined) => string,
  Indexes["labelsByValue"],
];

type UseMultiComboType = (params: DataLifeCycle) => UseMultiComboReturnType;

const useMultiCombo: UseMultiComboType = (payload) => {
  const indexes = useMemo(() => {
    //
    if (!payload.precompute) return payload.indexes;

    //
    const labelsByValue: Record<string, string> = {};
    const groups = payload.data;
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (!group) continue;

      for (let j = 0; j < group.items.length; j++) {
        const item = group.items[j];
        if (!item) continue;

        labelsByValue[item.value] = item.label;
      }
    }

    return { labelsByValue };
  }, [payload]);

  //
  const getSelectedLabels = useCallback(
    (selectedValues: string[]): string[] => {
      if (!Array.isArray(selectedValues) || !selectedValues.length) return [];

      return selectedValues
        .map((val) => indexes.labelsByValue?.[val])
        .filter((label) => label !== undefined) as string[];
    },
    [indexes.labelsByValue]
  );

  //
  const handleSelect = useCallback(
    (value: string, selectedValues: string[]) => {
      //
      const set = new Set<string>(selectedValues || []);

      if (set.has(value)) {
        //
        set.delete(value);
        return [...set];
      }

      set.add(value);
      return [...set];
    },
    []
  );

  //
  const isSelected = useCallback((value: string, selectedValues: string[]) => {
    const set = new Set(selectedValues);

    return set.has(value);
  }, []);

  //
  const getErrorMessages = (error: FieldError | undefined) => {
    if (!error) return "";
    if (!Array.isArray(error)) return "";

    return Object.values((error as FieldError[]) || {})
      .map((err) => err?.message)
      .filter(Boolean)
      .join(", ");
  };

  // const groupsx: ComboBoxGroup[] = useMemo(() => {
  //   if (!data.groups?.length) {
  //     //
  //     if (!precompute) {
  //       return [
  //         { id: "n_parents", label: undefined, itemIds: data.flatIds || [] },
  //       ];
  //     }

  //     // precompute [true]
  //     const length = data.items.length;
  //     const itemIds = new Array(length);
  //     for (let i = 0; i < length; i++) {
  //       itemIds[i] = data.items[i]?.id as string;
  //     }

  //     return [{ id: "n_parents", label: undefined, itemIds }];
  //   }

  //   return data.groups;
  // }, [data, precompute]);

  // const errorMessage = useMemo(() => {
  //   if (!controller.fieldState.error) return "";
  //   if (!Array.isArray(controller.fieldState.error)) return "";

  //   return Object.values((controller.fieldState.error as FieldError[]) || {})
  //     .map((err) => err?.message)
  //     .filter(Boolean)
  //     .join(", ");
  // }, [controller.fieldState.error]);

  return [
    getSelectedLabels,
    handleSelect,
    isSelected,
    getErrorMessages,
    indexes.labelsByValue,
  ];
};

type RHFMultiComboBoxItem = ComboBoxItem;
type RHFMultiComboBoxGroup = ComboBoxGroup;

export { useMultiCombo };
export type {
  DataLifeCycle,
  RHFMultiComboBoxGroup,
  RHFMultiComboBoxItem,
  UseMultiComboType,
};

type ComboGroup = {
  id: string;
  label: string;
  items: ComboItem[];
};

type ComboItem = {
  id: string;
  label: string;
  value: string;
};
