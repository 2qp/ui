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

import type { ComponentPropsWithoutRef, JSX, ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type RHFCommandItemProps = ComponentPropsWithoutRef<typeof CommandItem>;

// see .vscode tw attributes
type RHFComboBoxStyles = {
  comboClassName?: string;
  comboItemClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFComboBoxeDataPoint = {
  label: string;
  leading?: ReactNode;
} & RHFCommandItemProps;

// --- TYPE GUARD ---
type StringPattern<T> = {
  [K in keyof T]: T[K] extends `${infer _}` ? K : never;
}[keyof T];

type ArrayStringPattern<T> = {
  [K in keyof T]: T[K] extends string[] ? K : never;
}[keyof T];

type ComboNameGuard<T extends string, TShape, TMode> = TMode extends
  | undefined
  | false
  ? T extends StringPattern<TShape>
    ? T
    : never
  : TMode extends true
    ? T extends ArrayStringPattern<TShape>
      ? T
      : never
    : never;
// --- ---

type RHFComboBoxProps<T extends FieldValues, TMode> = {
  name: ComboNameGuard<Path<T>, T, TMode>;
  control: Control<T>;

  data: RHFComboBoxeDataPoint[] | Readonly<RHFComboBoxeDataPoint[]>;
  multi?: TMode;

  readOnly?: boolean;
  disabled?: boolean;

  label?: string;
  description?: string;

  styles?: RHFComboBoxStyles;
};

type RHFComboBoxType = <
  T extends FieldValues,
  TMode extends boolean | undefined = undefined,
>(
  props: RHFComboBoxProps<T, TMode>
) => JSX.Element;

const RHFComboBox: RHFComboBoxType = ({
  control,
  name,
  label,
  data,
  description,
  styles,
  multi = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        //
        const valueSet = new Set(field.value);

        const values = data
          .filter((point) => valueSet.has(point.value))
          .map((point) => point.label)
          .join(", ");

        return (
          <FormItem className="flex flex-col">
            <FormLabel className={cn(styles?.labelClassName)}>
              {label}
            </FormLabel>
            <Popover>
              <PopoverTrigger ref={field.ref} asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[200px] justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {!multi &&
                      (field.value
                        ? data.find((point) => point.value === field.value)
                            ?.label
                        : "Select language")}

                    {multi && (
                      <p className="overflow-hidden truncate">{values}</p>
                    )}

                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search framework..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {data.map((point, index) => (
                        <CommandItem
                          {...point}
                          value={point.value}
                          keywords={[point.label]}
                          key={index}
                          onSelect={() => {
                            //
                            if (!multi) {
                              field.onChange(point.value);
                              return;
                            }

                            //

                            if (!field.value) {
                              //
                              field.onChange([point.value]);
                              return;
                            }

                            if (Array.isArray(field.value)) {
                              // const valueSet = new Set(field.value);

                              if (valueSet.has(point.value)) {
                                //
                                const set = new Set(valueSet);
                                set.delete(point.value);

                                field.onChange([...set]);
                                return;
                              }

                              const set = new Set(valueSet).add(point.value);
                              field.onChange([...set]);
                              return;
                            }

                            //
                          }}
                        >
                          <div key={index + "-leading"}>{point.leading}</div>
                          <div key={index + "-value"}>{point.label}</div>

                          <Check
                            key={index + "-check"}
                            className={clsx("opacity-0 ml-auto", {
                              "opacity-100":
                                valueSet.has(point.value) ||
                                field.value === point.value,
                            })}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription className={cn(" ", styles?.descriptionClassName)}>
              {description}
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export { RHFComboBox };
export type { RHFComboBoxProps, RHFComboBoxType };
