import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ComponentPropsWithoutRef, JSX, ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type RHFSelectItemProps = ComponentPropsWithoutRef<typeof SelectItem>;

type RHFSelectStyles = {
  comboClassName?: string;
  comboItemClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type LiteralStringKeys<T> = {
  [K in keyof T]: T[K] extends `${infer _}` ? K : never;
}[keyof T];

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type RestrictKeys<
  T extends string | string[],
  TShape,
  TSafety,
> = TSafety extends true | undefined
  ? T extends LiteralStringKeys<TShape>
    ? T
    : never
  : T extends StringKeys<TShape>
    ? T
    : never;

type RHFSelectProps<
  T extends FieldValues,
  TSafety extends boolean | undefined,
> = {
  name: RestrictKeys<Path<T>, T, TSafety>;
  control: Control<T>;

  data: RHFSelectGroup[] | Readonly<RHFSelectGroup[]>;
  safety?: TSafety;

  readOnly?: boolean;
  disabled?: boolean;

  label?: string;
  description?: ReactNode;
  placeholder?: string;

  styles?: RHFSelectStyles;
};

type RHFSelectItem = {
  id?: string;
  label: string;
  leading?: ReactNode;
} & RHFSelectItemProps;

type RHFSelectGroup = {
  id: string;
  label: string;
  items: RHFSelectItem[] | Readonly<RHFSelectItem[]>;
};

type RHFSelectType = <
  T extends FieldValues,
  TSafety extends boolean | undefined = true,
>(
  props: RHFSelectProps<T, TSafety>
) => JSX.Element;

const RHFSelect: RHFSelectType = ({
  control,
  name,
  label,
  description,
  placeholder,
  data,
}) => {
  //

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            {...field}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger ref={field.ref}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {data?.map((group) => (
                <SelectGroup key={group.id}>
                  {group.label && <SelectLabel>{group.label}</SelectLabel>}

                  {group?.items?.map((data) => (
                    <SelectItem key={data.id || data.label} {...data}>
                      {data.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { RHFSelect };
export type { RHFSelectProps, RHFSelectType };
