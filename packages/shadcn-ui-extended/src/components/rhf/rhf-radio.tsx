import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import type { ComponentPropsWithoutRef, JSX, ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupItem>;

// see .vscode tw attributes
type RHFRadioStyles = {
  groupClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFRadioDataPoint = {
  label: ReactNode;
  leading?: ReactNode;
} & RadioGroupItemProps;

type RHFRadioProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;

  data: RHFRadioDataPoint[] | Readonly<RHFRadioDataPoint[]>;

  readOnly?: boolean;
  disabled?: boolean;

  label?: string;
  description?: string;

  styles?: RHFRadioStyles;
};

type RHFRadioType = <T extends FieldValues>(
  props: RHFRadioProps<T>
) => JSX.Element;

const RHFRadio: RHFRadioType = ({
  control,
  name,
  description,
  label,
  styles,
  data,
  disabled = false,
  readOnly = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {/*  */}
            <RadioGroup
              defaultValue={field.value}
              onValueChange={field.onChange}
              className={cn("flex flex-col space-y-1", styles?.groupClassName)}
              disabled={disabled}
              aria-readonly={readOnly}
              {...field}
            >
              {data?.map((point, index) => {
                //
                return (
                  <FormItem
                    key={index}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem {...point} />
                    </FormControl>
                    <FormLabel>{point.label}</FormLabel>
                  </FormItem>
                );
              })}

              {/*  */}
            </RadioGroup>
            {/*  */}
          </FormControl>
          <FormDescription className={cn(styles?.descriptionClassName)}>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { RHFRadio };
export type { RHFRadioDataPoint, RHFRadioProps, RHFRadioType };
