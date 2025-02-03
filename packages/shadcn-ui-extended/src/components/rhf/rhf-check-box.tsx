import { Checkbox } from "@repo/shadcn-ui/components/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/shadcn-ui/components/form";

import type { JSX, ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type RHFCheckBoxStyles = {
  checkClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFCheckBoxProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;

  disabled?: boolean;
  readOnly?: boolean;

  label?: string;
  description?: ReactNode;

  styles?: RHFCheckBoxStyles;
};

type RHFCheckBoxType = <T extends FieldValues>(
  props: RHFCheckBoxProps<T>
) => JSX.Element;

const RHFCheckBox: RHFCheckBoxType = ({
  control,
  name,
  label,
  description,
  styles,
  disabled = false,
  readOnly = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className={styles?.checkClassName}
              disabled={disabled}
              aria-readonly={readOnly}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className={styles?.labelClassName}>{label}</FormLabel>
            <FormDescription className={styles?.descriptionClassName}>
              {description}
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
};

export { RHFCheckBox };
export type { RHFCheckBoxProps, RHFCheckBoxType };
