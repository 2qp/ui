import { useCallback, useMemo } from "react";

import type { ReactNode } from "react";

// --- TYPE GUARD ---

type LiteralStringKeys<T> = {
  [K in keyof T]: T[K] extends `${infer _}` ? K : never;
}[keyof T];

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type RestrictKeys<
  T extends string | string[],
  TShape,
  TSafety extends boolean | undefined = true,
> = TSafety extends true | undefined
  ? T extends LiteralStringKeys<TShape>
    ? T
    : never
  : T extends StringKeys<TShape>
    ? T
    : never;

// --- ---

type RHFComboBoxItem = {
  id: string;
  label: string;
  leading?: ReactNode;
  value: string;
};

type RHFComboBoxGroup = {
  id: string;
  label?: string;
  items: RHFComboBoxItem[];
};

type DataLifeCycle = {
  data: RHFComboBoxGroup[] | Readonly<RHFComboBoxGroup[]>;
} & (
  | { precompute: true }
  | {
      precompute: false;
      /**
       * labelsByValue `Record<value, label>`
       */
      labels: Record<string, string>;
    }
);

type UseComboParams = {} & DataLifeCycle;

type UseComboType = (
  params: UseComboParams
) => [
  (value: string) => string | undefined,
  (value: string, fieldValue: unknown) => boolean,
];

const useCombo: UseComboType = (props) => {
  //

  const indexes = useMemo(() => {
    //
    if (!props.precompute) return { labelsByValue: props.labels };

    const labelsByValue: Record<string, string> = {};
    const groups = props.data;
    const length = props.data.length;

    for (let i = 0; i < length; i++) {
      const group = groups[i];
      if (!group) continue;

      const len = group.items.length;

      for (let j = 0; j < len; j++) {
        const item = group.items[j];
        if (!item) continue;

        labelsByValue[item.value] = item.label;
      }
    }

    return {
      labelsByValue,
    };

    //
  }, [props]);

  const getSelectedLabel = useCallback(
    (value: string): string | undefined => indexes.labelsByValue[value],
    [indexes.labelsByValue]
  );

  const isSelected = (value: string, fieldValue: unknown) =>
    fieldValue === value;

  return [getSelectedLabel, isSelected];
};

export { useCombo };
export type { DataLifeCycle, RestrictKeys, UseComboParams, UseComboType };
