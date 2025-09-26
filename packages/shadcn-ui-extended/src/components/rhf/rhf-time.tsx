import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { TimePicker12Demo } from "../ui/time-picker-12h-demo";
import { TimePickerDemo } from "../ui/time-picker-demo";

import type { JSX, ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { TimePickerType } from "../../utils/time-picker-utils";

type RHFTimeStyles = {
  timeClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFTimeProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;

  disabled?: boolean;
  readOnly?: boolean;

  label?: string;
  description?: ReactNode;

  segments?: TimePickerType[];
  type?: Extract<TimePickerType, "12hours" | "hours">;

  styles?: RHFTimeStyles;
};

type RHFTimeType = <T extends FieldValues>(
  props: RHFTimeProps<T>
) => JSX.Element;

const RHFTime: RHFTimeType = ({
  control,
  name,
  label,
  description,
  styles,
  type = "hours",
  segments = ["hours", "minutes", "seconds"],
  disabled = false,
  readOnly = false,
}) => {
  //

  //
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-left">{label}</FormLabel>

          <FormControl className="p-3 border border-border rounded-sm">
            {/* https://time.openstatus.dev */}

            <div className="flex items-end gap-2">
              {/*  */}

              {type === "hours" && (
                <TimePickerDemo date={field.value} setDate={field.onChange} />
              )}

              {type === "12hours" && (
                <TimePicker12Demo date={field.value} setDate={field.onChange} />
              )}

              {/*  */}
            </div>

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

export { RHFTime };
export type { RHFTimeProps, RHFTimeType };
