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
import { useMemo } from "react";

import type { ComponentProps, JSX, ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

// see .vscode tw attributes
type RHFPhoneStyles = {
  inputClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

// --- TYPE GUARD ---

type GetPrefix<T, Suffix extends string> = T extends `${infer Prefix}.${Suffix}`
  ? Prefix
  : never;

type TupleToIntersection<T extends readonly unknown[]> = T extends [
  infer First,
  ...infer Rest,
]
  ? First & TupleToIntersection<Rest>
  : unknown;

type ParentPrefixes<
  T,
  Suffixes extends readonly string[],
> = TupleToIntersection<{
  [K in keyof Suffixes]: GetPrefix<T, Suffixes[K] & string>;
}>;

//---

type ValidParent<T> = Extract<ParentPrefixes<T, ["dialCode", "number"]>, T>;

// --- ---

type RHFCommandItemProps = ComponentProps<typeof CommandItem>;

type RHFPhoneLeadingDataPoint = RHFCommandItemProps & {
  label: string;
  leading?: ReactNode;
  value: string; // !
  code: string;
};

type RHFPhoneProps<T extends FieldValues> = {
  control: Control<T>;

  /**
   * **Zod schema object** (or parent schema) name
   * that contains the properties `.dialCode` and `.number`.
   */
  name: ValidParent<Path<T>>;

  type?: ComponentProps<"input">["type"];
  label?: string;
  placeholder?: string;
  empty?: string;
  leadingPlaceholder?: string;
  description?: string;

  leading: RHFPhoneLeadingDataPoint[] | Readonly<RHFPhoneLeadingDataPoint[]>;

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
  leading,
  type = "tel",
}) => {
  //

  const leadingMap = useMemo(() => {
    return new Map(leading.map((item) => [item.value, item]));
  }, [leading]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        //

        // const selected = leading.find(
        //   (code) => code.value === field?.value?.["dialCode"]
        // );

        const selected = leadingMap.get(field?.value?.["dialCode"]);

        return (
          <FormItem>
            <FormLabel className={cn(styles?.labelClassName)}>
              {label}
            </FormLabel>
            <FormControl>
              <div className="flex gap-2">
                {/* COMBO */}

                <Popover>
                  <PopoverTrigger ref={field.ref} asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "min-w-[125px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {selected ? (
                          <div className="flex gap-2 items-center w-full justify-between">
                            {selected.leading} {selected.value}
                          </div>
                        ) : (
                          "Select dial code"
                        )}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
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
                          {leading.map((point, index) => (
                            <CommandItem
                              {...point}
                              value={point.value}
                              keywords={[point.label, point.value, point.code]}
                              key={index}
                              onSelect={() =>
                                field.onChange({
                                  ...field.value,
                                  dialCode: point.value,
                                })
                              }
                            >
                              <div key={index + "-leading"}>
                                {point.leading}
                              </div>
                              <div key={index + "-value"}>{point.label}</div>
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
                  value={field?.value?.["number"] ?? ""}
                  onChange={(e) => {
                    field.onChange({
                      ...field.value,
                      number: e.currentTarget.value,
                    });
                  }}
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

export { RHFPhone };
export type { RHFPhoneProps, RHFPhoneType };
