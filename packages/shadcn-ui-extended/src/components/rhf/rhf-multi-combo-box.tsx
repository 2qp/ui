import { useMultiCombo } from "@repo/shadcn-ui-extended/hooks/use-multi-combo";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { Check, ChevronsUpDown } from "lucide-react";

import type { DataLifeCycle } from "@repo/shadcn-ui-extended/hooks/use-multi-combo";
import type { JSX } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

// see .vscode tw attributes
type RHFMultiComboBoxStyles = {
  comboClassName?: string;
  comboItemClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

// --- TYPE GUARD ---

type StringLiteralArrayKeys<T> = {
  [K in keyof T]: T[K] extends `${infer _}`[] ? K : never;
}[keyof T];

type StringArrayKeys<T> = {
  [K in keyof T]: T[K] extends string[] ? K : never;
}[keyof T];

type RestrictKeys<
  T extends string | string[],
  TShape,
  TSafety extends boolean = true,
> = TSafety extends true
  ? T extends StringLiteralArrayKeys<TShape>
    ? T
    : never
  : T extends StringArrayKeys<TShape>
    ? T
    : never;
// --- ---

type RHFMultiComboBoxProps<
  T extends FieldValues,
  TSafety extends boolean = true,
> = {
  name: RestrictKeys<Path<T>, T, TSafety>;
  control: Control<T>;

  safety?: TSafety;

  readOnly?: boolean;
  disabled?: boolean;

  label?: string;
  empty?: string;
  placeholder?: string;
  searchholder?: string;
  description?: string;

  styles?: RHFMultiComboBoxStyles;
} & DataLifeCycle;

type RHFMultiComboBoxType = <
  T extends FieldValues,
  TSafety extends boolean = true,
>(
  props: RHFMultiComboBoxProps<T, TSafety>
) => JSX.Element;

const RHFMultiComboBox: RHFMultiComboBoxType = ({
  control,
  name,
  label,
  empty,
  placeholder,
  searchholder,
  description,
  styles,
  safety,
  readOnly,
  disabled,
  ...payload
}) => {
  //

  const [getSelectedLabels, handleSelect, isSelected] = useMultiCombo(payload);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className={cn(styles?.labelClassName)}>{label}</FormLabel>
          <Popover modal={true}>
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
                    {getSelectedLabels(field.value).join(", ") || placeholder}
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

                  {payload.data.map((group) => (
                    <CommandGroup key={group.id} heading={group.label}>
                      {group.items.map((item, index) => {
                        const selected = isSelected(item.value, field.value);

                        return (
                          <CommandItem
                            {...item}
                            value={item.value}
                            keywords={[item.label]}
                            key={item.id || index}
                            onSelect={() => {
                              const result = handleSelect(
                                item.value,
                                field.value
                              );

                              field.onChange(result);
                            }}
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
        /* */
      )}
    />

    /* */
  );
};

export { RHFMultiComboBox };
export type { RHFMultiComboBoxProps, RHFMultiComboBoxType };
