import { Button } from "@repo/shadcn-ui/components/button";
import { Calendar } from "@repo/shadcn-ui/components/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/shadcn-ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/shadcn-ui/components/popover";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { format, getDate, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import type { CalendarProps } from "@repo/shadcn-ui/components/calendar";
import type { JSX, ReactNode } from "react";
import type { DaySelectionMode } from "react-day-picker";

import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

type RHFDateStyles = {
  calendarClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFDateConfig = Omit<CalendarProps, "selected" | "onSelect" | "mode">;

type ExtractDateArrayKey<T> = {
  [K in keyof T]: T[K] extends Date[] | undefined ? K : never;
}[keyof T];

type ValidParent<T extends string, TMode, TShape> = TMode extends "range"
  ? T extends `${infer Parent}.from` | `${infer Parent}.to`
    ? `${Parent}`
    : never
  : TMode extends "multiple"
    ? ExtractDateArrayKey<TShape>
    : T;

type ExtractTFieldValues<T> =
  T extends Control<infer TFieldValues, unknown> ? TFieldValues : never;

type RHFDateProps<T extends FieldValues, TMode extends DaySelectionMode> = {
  name: ValidParent<Path<T>, TMode, T>;

  control: Control<T>;

  config?: RHFDateConfig;

  disabled?: boolean;
  readOnly?: boolean;

  label?: string;
  description?: ReactNode;

  mode: TMode;

  styles?: RHFDateStyles;
};

type RHFDateType = <T extends FieldValues, TMode extends DaySelectionMode>(
  props: RHFDateProps<T, TMode>
) => JSX.Element;

const RHFDate: RHFDateType = ({
  control,
  name,
  label,
  description,
  styles,
  mode,
  config,
}) => {
  //
  return (
    <FormField
      control={control}
      name={name as Path<ExtractTFieldValues<typeof control>>}
      render={({ field }) => {
        //

        return (
          <FormItem className="flex flex-col">
            <FormLabel className="text-left">{label}</FormLabel>
            <Popover>
              <FormControl>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <Renderer field={field} mode={mode} />
                  </Button>
                </PopoverTrigger>
              </FormControl>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  {...field}
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  numberOfMonths={1}
                  mode={mode}
                  {...config}
                  // intellisense err
                />
              </PopoverContent>
            </Popover>
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

export { RHFDate };
export type { RHFDateProps, RHFDateType };

// RENDERER
type RendererProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  mode: DaySelectionMode;
};

type RendererType = <T extends FieldValues>(
  props: RendererProps<T>
) => JSX.Element;

const Renderer: RendererType = ({ mode, field }) => {
  //
  if (!field.value) return <div>{"Pick a date"}</div>;

  switch (mode) {
    case "default":
    case "single":
      return (
        <div className="overflow-hidden truncate ">
          {isValid(field.value) ? (
            format(field.value, "PPP")
          ) : (
            <span>{"Invalid date"}</span> // fallback for invalid date
          )}
        </div>
      );

    case "multiple":
      return (
        <div className="overflow-hidden truncate ">
          {formatMultipleDates(field.value)}
        </div>
      );

    case "range":
      return (
        <div className="overflow-hidden truncate">
          {isValid(field.value.from) || isValid(field.value.to) ? (
            <>
              {isValid(field.value.from) && format(field.value.from, "PPP")}
              {isValid(field.value.from) && isValid(field.value.to)
                ? " - "
                : ""}
              {isValid(field.value.to) && format(field.value.to, "PPP")}
            </>
          ) : (
            <span>{"Invalid date range"}</span> // fallback for invalid date range
          )}
        </div>
      );
  }

  return <></>;
};

const formatMultipleDates = (dates: Date[]): string => {
  //

  const grouped = dates.reduce(
    (acc, date) => {
      const parsedDate = typeof date === "string" ? parseISO(date) : date;
      const monthYear = format(parsedDate, "yyy MMM");

      if (!acc[monthYear]) {
        acc[monthYear] = new Set<number>();
      }

      acc[monthYear].add(getDate(parsedDate));

      return acc;
    },
    {} as Record<string, Set<number>>
  );

  return Object.entries(grouped)
    .map(([monthYear, days]) => `${monthYear} : ${Array.from(days).join(", ")}`)
    .join(" & ");
};
