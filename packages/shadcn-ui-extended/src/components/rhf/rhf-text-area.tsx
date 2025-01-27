import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/shadcn-ui/components/form";
import { Textarea } from "@repo/shadcn-ui/components/textarea";
import { cn } from "@repo/shadcn-ui/lib/utils";

import type { JSX } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type RHFTextAreaStyles = {
  areaClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFTextAreaProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;

  readOnly?: boolean;
  disabled?: boolean;

  label?: string;
  placeholder?: string;
  description?: string;

  styles?: RHFTextAreaStyles;
};

type RHFTextAreaType = <T extends FieldValues>(
  props: RHFTextAreaProps<T>
) => JSX.Element;

const RHFTextArea: RHFTextAreaType = ({
  control,
  name,
  description,
  label,
  placeholder,
  styles,
  disabled = false,
  readOnly = false,
}) => {
  return (
    //
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn(styles?.labelClassName)}>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className={cn(styles?.areaClassName)}
              disabled={disabled}
              readOnly={readOnly}
              //
              {...field}
            />
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

export { RHFTextArea };
export type { RHFTextAreaProps, RHFTextAreaType };
