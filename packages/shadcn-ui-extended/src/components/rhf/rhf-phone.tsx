import { usePhone } from "@repo/shadcn-ui-extended/hooks/use-phone";
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
import { Input } from "@repo/shadcn-ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/shadcn-ui/components/popover";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { CircleFlag } from "react-circle-flags";

import type {
  CountryCode,
  ValidParent,
} from "@repo/shadcn-ui-extended/hooks/use-phone";
import type { ComponentProps, JSX } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

// see .vscode tw attributes
type RHFPhoneStyles = {
  inputClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

// --- ---

type RHFPhoneProps<T extends FieldValues> = {
  control: Control<T>;
  /**
   * **Zod schema object** (or parent schema) name
   * that contains the properties `.country` and `.number`.
   */
  name: ValidParent<Path<T>>;

  type?: ComponentProps<"input">["type"];
  label?: string;
  placeholder?: string;
  empty?: string;
  leadingPlaceholder?: string;
  description?: string;

  styles?: RHFPhoneStyles;
};

type RHFPhoneType = <T extends FieldValues>(
  props: RHFPhoneProps<T>
) => JSX.Element;

const RHFPhone: RHFPhoneType = ({
  control,
  name,
  label,
  placeholder,
  empty,
  leadingPlaceholder,
  description,
  styles,
  type = "tel",
}) => {
  //

  const [array, format, replace] = usePhone();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        //

        const numberField: string = field.value?.["number"];
        const countryField: CountryCode = field.value?.["country"];

        const { country, number } = format({
          number: numberField,
          country: countryField,
        });

        return (
          <FormItem>
            <FormLabel id={name} className={cn(styles?.labelClassName)}>
              {label}
            </FormLabel>
            <FormControl>
              <div className="flex gap-2">
                {/* COMBO */}

                <Popover modal={true}>
                  <PopoverTrigger ref={field.ref} asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-fit justify-between",
                        !numberField && "text-muted-foreground"
                      )}
                    >
                      {country ? (
                        <span>
                          {/*  */}
                          <CircleFlag
                            countryCode={country?.toLowerCase()}
                            height={25}
                            width={25}
                          />
                        </span>
                      ) : (
                        <SkelentonLoader />
                      )}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder={leadingPlaceholder}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>{empty}</CommandEmpty>
                        <CommandGroup>
                          {array.map((point, index) => (
                            <CommandItem
                              {...point}
                              value={point.value}
                              keywords={point.keywords}
                              key={index}
                              onSelect={() => {
                                const result = replace(
                                  numberField,
                                  point.value
                                );

                                field.onChange({
                                  number: result,
                                  country: point.value,
                                });
                              }}
                            >
                              <div className="flex gap-5">
                                {/*  */}
                                <CircleFlag
                                  countryCode={point.value.toLowerCase()}
                                  height={25}
                                  width={25}
                                />
                                <div>{point.label}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* COMBO ENDS */}

                <Input
                  key={"number"}
                  {...field}
                  value={number}
                  onChange={(e) =>
                    field.onChange({
                      country,
                      number: e.currentTarget.value,
                    })
                  }
                  placeholder={placeholder}
                  type={type}
                  className={cn(styles?.inputClassName)}
                />
              </div>
            </FormControl>
            <FormDescription className={cn(styles?.descriptionClassName)}>
              {description}
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

//
// type SkelentonLoaderProps = {};

type SkelentonLoaderType = () => JSX.Element;

const SkelentonLoader: SkelentonLoaderType = () => {
  return (
    <div
      className="animate-pulse bg-gray-300 rounded-full"
      style={{ width: 25, height: 25 }}
    ></div>
  );
};

export { RHFPhone };
export type { RHFPhoneProps, RHFPhoneType };
