import { Button } from "@repo/shadcn-ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/shadcn-ui/components/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/shadcn-ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/shadcn-ui/components/popover";
import { cn } from "@repo/shadcn-ui/lib/utils";
import clsx from "clsx";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useMemo } from "react";

import type { ComponentPropsWithoutRef, JSX, ReactNode } from "react";
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

type RHFCommandItemProps = ComponentPropsWithoutRef<typeof CommandItem>;

// see .vscode tw attributes
type RHFComboBoxStyles = {
  comboClassName?: string;
  comboItemClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFComboBoxItem = {
  label: string;
  leading?: ReactNode;
  value: string;
} & RHFCommandItemProps;

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

type RHFComboBoxProps<
  T extends FieldValues,
  TSafety extends boolean | undefined = true,
> = {
  name: RestrictKeys<Path<T>, T, TSafety>;
  control: Control<T>;

  safety?: TSafety;

  readOnly?: boolean;
  disabled?: boolean;

  label?: string;
  empty?: string;
  searchholder?: string;
  placeholder?: string;
  description?: string;

  styles?: RHFComboBoxStyles;
} & DataLifeCycle;

type RHFComboBoxType = <
  T extends FieldValues,
  TSafety extends boolean | undefined = true,
>(
  props: RHFComboBoxProps<T, TSafety>
) => JSX.Element;

const RHFComboBox: RHFComboBoxType = ({
  control,
  name,
  label,
  data,
  empty,
  searchholder,
  placeholder,
  description,
  styles,
  disabled,
  readOnly,

  ...props
}) => {
  //

  //
  const labels = useMemo(() => {
    if (!props.precompute) return props.labels;

    const labelsByValue: Record<string, string> = {};
    const groups = data;
    const length = data.length;

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

    return labelsByValue;
  }, [data, props]);

  const isSelected = <T extends FieldValues>(
    point: RHFComboBoxItem,
    fieldValue: ControllerRenderProps<T, Path<T>>["value"]
  ) => fieldValue === point.value;

  const getSelectedLabel = useCallback(
    (value: string): string | undefined => labels[value],
    [labels]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className={cn(styles?.labelClassName)}>{label}</FormLabel>
          <Popover>
            <PopoverTrigger ref={field.ref} asChild>
              <FormControl>
                <Button
                  disabled={disabled}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <p className="overflow-hidden truncate">
                    {getSelectedLabel(field.value) || placeholder}
                  </p>

                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  readOnly={readOnly}
                  placeholder={searchholder}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>{empty}</CommandEmpty>
                  {data.map((group) => (
                    <CommandGroup key={group.id} heading={group.label}>
                      {group.items.map((item, index) => {
                        //

                        const selected = isSelected(item, field.value);

                        return (
                          <CommandItem
                            {...item}
                            value={item.value}
                            keywords={[item.label]}
                            key={item.id || index}
                            onSelect={() =>
                              field.onChange(
                                field.value === item.value ? "" : item.value
                              )
                            }
                          >
                            <div className="flex items-center justify-between w-full">
                              <div>{item.leading}</div>
                              <div>{item.label}</div>
                              <Check
                                className={clsx(
                                  "ml-auto transition-opacity duration-75",
                                  {
                                    "opacity-0": !selected,
                                    "opacity-100": selected,
                                  }
                                )}
                              />
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription className={cn(" ", styles?.descriptionClassName)}>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { RHFComboBox };
export type { RHFComboBoxProps, RHFComboBoxType };
