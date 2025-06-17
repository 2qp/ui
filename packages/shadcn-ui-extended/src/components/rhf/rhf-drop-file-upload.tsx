import { Button } from "@repo/shadcn-ui/components/button";
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
import clsx from "clsx";
import { X } from "lucide-react";

import type { JSX } from "react";
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

type RHFDropFileUploadStyles = {
  inputClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFDropFileUploadProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;

  type?: "single" | "multi";

  label?: string;
  placeholder?: string;
  description?: string;

  styles?: RHFDropFileUploadStyles;
};

type RHFDropFileUploadType = <T extends FieldValues>(
  props: RHFDropFileUploadProps<T>
) => JSX.Element;

type HandleDrop = <T extends FieldValues>(
  e: React.DragEvent,
  field: ControllerRenderProps<T, Path<T>>
) => void;

type HandleRemoval = <T extends FieldValues>(
  field: ControllerRenderProps<T, Path<T>>,
  index: number | undefined
) => void;

const RHFDropFileUpload: RHFDropFileUploadType = ({
  control,
  name,
  label,
  placeholder,
  description,
  styles,
  type = "single",
}) => {
  //

  const handleDrop: HandleDrop = (e, field) => {
    e.preventDefault();

    const droppedFiles = e.dataTransfer.files;

    if (!droppedFiles) return;

    const fileArray = Array.from(droppedFiles);

    if (type === "single") {
      //

      const file = fileArray?.[0];

      if (!file) return;

      field.onChange(file);

      return;
    }

    //
    const selectedFiles = fileArray;
    const existingFiles = [...(field?.value ?? [])];

    const files = [...existingFiles, ...(selectedFiles ?? [])];

    field.onChange(files);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleRemoval: HandleRemoval = (field, index) => {
    //

    if (type === "single") {
      field.onChange(undefined);
      return;
    }

    const existingFiles = field.value;

    if (!Array.isArray(existingFiles)) return;
    if (index === undefined || index === null) return;

    const updatedFiles = [
      ...existingFiles.slice(0, index),
      ...existingFiles.slice(index + 1),
    ];

    field.onChange(updatedFiles);
  };

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
              <div
                onDrop={(e) => handleDrop(e, field)}
                onDragOver={handleDragOver}
                className={clsx(
                  "border-[2px] border-dashed box-border border-neutral-50"
                )}
              >
                {/*  */}

                <Input
                  disabled={field.disabled}
                  name={field.name}
                  ref={field.ref}
                  onChange={(e) => {
                    //

                    if (type === "single") {
                      //

                      const file = e.currentTarget.files?.[0];

                      if (!file) return;

                      field.onChange(file);

                      return;
                    }

                    //
                    const selectedFiles = e.currentTarget.files;
                    const files = selectedFiles
                      ? Array.from(selectedFiles)
                      : [];
                    field.onChange(files);

                    //
                  }}
                  placeholder={placeholder}
                  type={"file"}
                  multiple={type === "multi"}
                  className={cn(styles?.inputClassName)}
                />

                <div>
                  {Array.isArray(field?.value) &&
                    field?.value?.map((file: File, index: number) => {
                      return (
                        <div key={index} className="flex gap-1">
                          <div>{file?.name}</div>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="size-8"
                            type="button"
                            onClick={() => handleRemoval(field, index)}
                          >
                            <X />
                          </Button>
                        </div>
                      );
                    })}

                  {!Array.isArray(field.value) && (
                    <div>{field.value?.["name"]}</div>
                  )}
                </div>
              </div>
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

export { RHFDropFileUpload };
export type { RHFDropFileUploadProps, RHFDropFileUploadType };
