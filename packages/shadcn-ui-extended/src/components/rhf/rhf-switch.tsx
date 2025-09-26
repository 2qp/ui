import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import type { JSX } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

// see .vscode tw attributes
type RHFSwitchStyles = {
  switchClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFSwitchProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;

  readOnly?: boolean;
  disabled?: boolean;

  label?: string;
  description?: string;

  styles?: RHFSwitchStyles;
};

type RHFSwitchType = <T extends FieldValues>(
  props: RHFSwitchProps<T>
) => JSX.Element;

const RHFSwitch: RHFSwitchType = ({
  control,
  name,
  description,
  label,
  styles,
  disabled = false,
  readOnly = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              aria-readonly={readOnly}
              className={cn("", styles?.switchClassName)}
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export { RHFSwitch };
export type { RHFSwitchProps, RHFSwitchType };
