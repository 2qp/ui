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

type RHFComboBoxProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;

  data: RHFComboBoxeDataPoint[] | Readonly<RHFComboBoxeDataPoint[]>;
  multi?: boolean;

  readOnly?: boolean;
  disabled?: boolean;

  label?: string;
  description?: string;

  styles?: RHFComboBoxStyles;
};

type RHFComboBoxType = <T extends FieldValues>(
  props: RHFComboBoxProps<T>
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
              <PopoverTrigger asChild>
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
                          key={index}
                          onSelect={(v) => {
                            //
                            if (!multi) {
                              field.onChange(point.value);
                              return;
                            }

                            //

                            if (!field.value) {
                              //
                              field.onChange([v]);
                              return;
                            }

                            if (Array.isArray(field.value)) {
                              // const valueSet = new Set(field.value);

                              if (valueSet.has(v)) {
                                //
                                const set = new Set(valueSet);
                                set.delete(v);

                                field.onChange([...set]);
                                return;
                              }

                              const set = new Set(valueSet).add(v);
                              field.onChange([...set]);
                              return;
                            }

                            //
                          }}
                        >
                          {point.leading}
                          <div key={index + "-value"}>{point.label}</div>

                          <Check
                            key={index + "-check"}
                            className={cn(
                              "ml-auto",
                              valueSet.has(point.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
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
