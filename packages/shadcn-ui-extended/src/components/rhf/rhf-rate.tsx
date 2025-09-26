import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { cloneElement, useState } from "react";

import type { LucideProps } from "lucide-react";
import type { JSX, ReactElement, ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

// see .vscode tw attributes
type RHFRateStyles = {
  elementClassName?: string;
  wraprClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type IconProps = LucideProps & {
  "data-active"?: boolean;
};

type IconType = ReactElement<IconProps>;

type RHFRateDataPoint = {
  label?: string;
  leading?: ReactNode;
  value: string | number;
  element: IconType;
};

type RHFRateProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;

  type?: "rate" | "mood";
  items: RHFRateDataPoint[];

  label?: string;
  description?: string;

  styles?: RHFRateStyles;
};

type RHFRateType = <T extends FieldValues>(
  props: RHFRateProps<T>
) => JSX.Element;

const RHFRate: RHFRateType = ({
  control,
  name,
  description,
  label,
  styles,
  items,
  type = "rate",
}) => {
  //

  const [hovering, setHovering] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        //

        const currentRating = items.findIndex(
          (point) => point.value === field.value
        );

        //
        return (
          <FormItem>
            <FormLabel className={cn(styles?.labelClassName)}>
              {label}
            </FormLabel>
            <FormControl>
              <div
                className={clsx(
                  "flex flex-row-reverse justify-center p-2 border",
                  styles?.wraprClassName,
                  {
                    "gap-3": type === "mood",
                  }
                )}
              >
                {items.map(({ label, value, leading, element }, index) => {
                  //

                  return cloneElement(element as IconType, {
                    key: index,
                    size: element.props.size || 50,
                    onClick: () => field.onChange(value),
                    onMouseEnter: () => setHovering(true),
                    onMouseLeave: () => setHovering(false),

                    className: clsx(
                      "fill-transparent transition-[fill] duration-300 ",

                      {
                        "!fill-[#d8d929] ":
                          (type === "rate" &&
                            !hovering &&
                            currentRating <= index) ||
                          (type === "mood" && currentRating === index),

                        "peer peer-hover:fill-[#d8d929] hover:fill-[#d8d929]":
                          type === "rate" && hovering,
                      },

                      element.props.className,
                      styles?.elementClassName
                    ),
                  });
                })}
              </div>
            </FormControl>
            <FormLabel className="">{items[currentRating]?.label}</FormLabel>
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

export { RHFRate };
export type { RHFRateProps, RHFRateType };
