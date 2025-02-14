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
  SelectItem,
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

  data: RHFSelectDataPoint[] | Readonly<RHFSelectDataPoint[]>;

  readOnly?: boolean;
  disabled?: boolean;

  label?: string;
  description?: ReactNode;
  placeholder?: string;

  styles?: RHFSelectStyles;
};

type RHFSelectDataPoint = {
  label: string;
  leading?: ReactNode;
} & RHFSelectItemProps;

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
      render={({ field }) => {
        //

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select {...field} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger ref={field.ref}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data?.map((point, index) => {
                  //

                  return (
                    <SelectItem key={index} {...point}>
                      {point.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export { RHFSelect };
export type { RHFSelectProps, RHFSelectType };
