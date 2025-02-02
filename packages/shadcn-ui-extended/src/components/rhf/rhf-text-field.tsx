import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/shadcn-ui/components/form";
import { Input } from "@repo/shadcn-ui/components/input";
import { cn } from "@repo/shadcn-ui/lib/utils";

import type { HTMLInputTypeAttribute, JSX } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

// see .vscode tw attributes
type RHFTextFieldStyles = {
  inputClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;

  type?: HTMLInputTypeAttribute;

  label?: string;
  placeholder?: string;
  description?: string;

  styles?: RHFTextFieldStyles;
};

type RHFTextFieldType = <T extends FieldValues>(
  props: RHFTextFieldProps<T>
) => JSX.Element;

const RHFTextField: RHFTextFieldType = ({
  control,
  name,
  label,
  placeholder,
  description,
  styles,
  type = "text",
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn(styles?.labelClassName)}>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              type={type}
              className={cn(styles?.inputClassName)}
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

export { RHFTextField };
export type { RHFTextFieldProps, RHFTextFieldType };
