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
import { useRef } from "react";

import type { ComponentProps, ReactNode } from "react";
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import type { JSX } from "react/jsx-runtime";

type RHFDropFileUploadStyles = {
  inputClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFDropFileUploadProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;

  type?: "single" | "multi";
  accept?: ComponentProps<"input">["accept"];

  label?: string;
  placeholder?: string;
  description?: string;

  styles?: RHFDropFileUploadStyles;

  children?: ReactNode;
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
  children,
  accept,
  type = "single",
}) => {
  //

  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const handleCustomButtonClick = () => inputRef.current?.click();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        //

        return (
          <FormItem>
            <FormLabel className={cn(styles?.labelClassName)}>
              {label}
            </FormLabel>
            <FormControl>
              {!field?.value && !fieldState.isDirty && (
                <div
                  onClick={handleCustomButtonClick}
                  onDrop={(e) => handleDrop(e, field)}
                  onDragOver={handleDragOver}
                  className={clsx(
                    "",
                    "cursor-pointer border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center space-y-2 hover:border-blue-500 transition",
                    "w-[280px] h-[200px]  ",
                    "transition-all"
                  )}
                >
                  {/*  */}

                  {/* <Video className="h-25 w-25 text-gray-700 fill-gray-700" /> */}

                  {/* icon or sum */}
                  {children}

                  <>
                    <p className="text-sm font-medium text-gray-300">
                      {"Choose file"}
                    </p>

                    <p className="text-xs text-gray-400">{"MP4 or WebM"}</p>
                  </>

                  <Input
                    disabled={field.disabled}
                    name={field.name}
                    // ref={field.ref}
                    accept={accept}
                    ref={(ref) => {
                      field.ref(ref);
                      inputRef.current = ref;
                    }}
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
                    className={cn(styles?.inputClassName, "hidden")}
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
                      <div className="text-black text-sm">
                        {field.value?.["name"]}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
