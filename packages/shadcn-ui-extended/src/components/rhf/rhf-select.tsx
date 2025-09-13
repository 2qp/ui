import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/shadcn-ui/components/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@repo/shadcn-ui/components/select";

import type { ComponentPropsWithoutRef, JSX, ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type RHFSelectItemProps = ComponentPropsWithoutRef<typeof SelectItem>;

type RHFSelectStyles = {
  comboClassName?: string;
  comboItemClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;

  data: RHFSelectGroup[] | Readonly<RHFSelectGroup[]>;

  readOnly?: boolean;
  disabled?: boolean;

  label?: string;
  description?: ReactNode;
  placeholder?: string;

  styles?: RHFSelectStyles;
};

type RHFSelectItem = {
  id: string;
  label: string;
  leading?: ReactNode;
} & RHFSelectItemProps;

type RHFSelectGroup = {
  id: string;
  label: string;
  items: RHFSelectItem[] | Readonly<RHFSelectItem[]>;
};

type RHFSelectType = <T extends FieldValues>(
  props: RHFSelectProps<T>
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
                    <SelectItem key={data.id} {...data}>
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
