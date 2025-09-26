import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

import type { ComponentPropsWithoutRef, JSX } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

type SliderProps = Omit<
  ComponentPropsWithoutRef<typeof Slider>,
  "onValueChange" | "onValueCommit" | "form" | "defaultValue" | "value" | "name"
>;

// see .vscode tw attributes
type RHFSliderStyles = {
  sliderClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFSliderProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;

  disabled?: boolean;
  readOnly?: boolean;

  label?: string;
  description?: string;

  config?: SliderProps;

  styles?: RHFSliderStyles;

  onValueCommit?: (value: number[]) => void;
};

type RHFSliderType = <T extends FieldValues>(
  props: RHFSliderProps<T>
) => JSX.Element;

const RHFSlider: RHFSliderType = ({
  control,
  name,
  description,
  label,
  styles,
  config,
  onValueCommit,
  disabled = false,
  readOnly = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className={cn(styles?.labelClassName)}>{label}</FormLabel>
          <FormControl>
            {/*  */}

            {/* https://github.com/shadcn-ui/ui/issues/871 | MULTIPLE THUMBS */}
            <Slider
              defaultValue={field.value}
              {...field}
              //
              max={100}
              step={1}
              minStepsBetweenThumbs={1}
              className={cn("w-[60%]", styles?.sliderClassName)}
              {...config}
              aria-readonly={readOnly}
              disabled={disabled}
              //
              onChange={(e) => {
                //
                e.preventDefault();
                return;
              }}
              onValueChange={(v) => {
                //
                // if (type !== "change") return;
                field.onChange(v);
              }}
              //
              onValueCommit={onValueCommit}
            />

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

export { RHFSlider };
export type { RHFSliderProps, RHFSliderType };
