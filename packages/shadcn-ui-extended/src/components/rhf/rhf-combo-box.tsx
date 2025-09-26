import { useCombo } from "@repo/shadcn-ui-extended/hooks/use-combo";
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

import type {
  DataLifeCycle,
  RestrictKeys,
} from "@repo/shadcn-ui-extended/hooks/use-combo";
import type { JSX } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

// see .vscode tw attributes
type RHFComboBoxStyles = {
  comboClassName?: string;
  comboItemClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

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
  const [getLabel, isSelected] = useCombo(props);

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
                    {getLabel(field.value) || placeholder}
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
                  {props.data.map((group) => (
                    <CommandGroup key={group.id} heading={group.label}>
                      {group.items.map((item, index) => {
                        //

                        const selected = isSelected(item.value, field.value);

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
