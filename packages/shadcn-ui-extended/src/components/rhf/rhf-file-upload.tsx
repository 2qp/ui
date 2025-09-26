import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { ComponentProps, JSX } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type RHFFileUploadStyles = {
  inputClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFFileUploadProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;

  type?: "single" | "multi";
  accept?: ComponentProps<"input">["accept"];

  label?: string;
  placeholder?: string;
  description?: string;

  styles?: RHFFileUploadStyles;
};

type RHFFileUploadType = <T extends FieldValues>(
  props: RHFFileUploadProps<T>
) => JSX.Element;

const RHFFileUpload: RHFFileUploadType = ({
  control,
  name,
  label,
  placeholder,
  description,
  styles,
  accept,
  type = "single",
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
            <FormLabel className={cn(styles?.labelClassName)}>
              {label}
            </FormLabel>
            <FormControl>
              <Input
                disabled={field.disabled}
                name={field.name}
                ref={field.ref}
                accept={accept}
                onChange={(e) => {
                  //

                  if (type === "single") {
                    //

                    const file = e.currentTarget.files?.[0];
                    console.log(file);
                    if (!file) return;

                    field.onChange(file);

                    return;
                  }

                  //
                  const selectedFiles = e.currentTarget.files;
                  const files = selectedFiles ? Array.from(selectedFiles) : [];
                  field.onChange(files);

                  //
                }}
                placeholder={placeholder}
                type={"file"}
                multiple={type === "multi"}
                className={cn(styles?.inputClassName)}
              />
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

export { RHFFileUpload };
export type { RHFFileUploadProps, RHFFileUploadType };
