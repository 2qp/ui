import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isSameDay, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { TimePickerDemo } from "../ui/time-picker-demo";

import type { ComponentProps, JSX, ReactNode } from "react";
import type { DateRange, Mode, Modifiers } from "react-day-picker";
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

type CalendarProps = ComponentProps<typeof Calendar>;

type RHFDateTimeStyles = {
  calendarClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFDateTimeConfig = Omit<CalendarProps, "selected" | "onSelect" | "mode">;

// --- TYPE GUARD ---

type ExtractDateArrayKey<T> = {
  [K in keyof T]: T[K] extends Date[] | undefined ? K : never;
}[keyof T];

type Parents<T, TMode, TShape> = TMode extends "range"
  ? T extends `${infer P}.from` | `${infer P}.to`
    ? P
    : never
  : TMode extends "multiple"
    ? ExtractDateArrayKey<TShape>
    : T;

type NameGuard<T, TMode, TShape> = Extract<Parents<T, TMode, TShape>, T>;

// --- ---

type RHFDateTimeProps<T extends FieldValues, TMode extends Mode> = {
  name: NameGuard<Path<T>, TMode, T>;

  control: Control<T>;

  config?: RHFDateTimeConfig;

  disabled?: boolean;
  readOnly?: boolean;

  label?: string;
  description?: ReactNode;

  mode: TMode;

  styles?: RHFDateTimeStyles;
};

type RHFDateTimeType = <T extends FieldValues, TMode extends Mode>(
  props: RHFDateTimeProps<T, TMode>
) => JSX.Element;

/**
 * @param name - `schemaName.from` - `schemaName.to`
 * @returns
 */
const RHFDateTime: RHFDateTimeType = ({
  control,
  name,
  label,
  description,
  styles,
  mode = "single" as const,
  config,
}) => {
  //

  const [currentIndex, setIndex] = useState(0);

  return (
    <FormField
      control={control}
      name={name}
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
                  numberOfMonths={1}
                  // intellisense err
                  mode={mode}
                  captionLayout="dropdown"
                  {...config}
                  //
                  onSelect={(
                    arg1: Date | Date[] | DateRange | undefined,
                    selectedDay: Date,
                    activeModifiers: Modifiers,
                    e: React.MouseEvent | React.KeyboardEvent
                  ) => {
                    // argument is undefined
                    if (typeof arg1 === "undefined") {
                      console.log("Day was unselected");
                      return;
                    }

                    //
                    field.onChange(arg1);

                    // single select
                    if (isSingleDate(arg1)) {
                      console.log("Single day selected:", arg1);
                      return;
                    }

                    // multiple select
                    if (isMultipleDates(arg1)) {
                      console.log("Multiple days selected:", arg1);
                      //

                      if (mode !== "multiple") return;
                      //
                      if (activeModifiers.selected) {
                        const lastItem = arg1[arg1.length - 1];

                        if (!lastItem) return;

                        const result: number | undefined = arg1?.findIndex(
                          (item: Date) => isSameDay(lastItem, item)
                        );

                        if (result === undefined) return;

                        setIndex(result);

                        return;
                      }

                      const result: number | undefined = arg1?.findIndex(
                        (item: Date) => isSameDay(selectedDay, item)
                      );

                      if (result === undefined) return;

                      setIndex(result);
                      return;
                    }

                    // range select
                    if (isDateRange(arg1)) {
                      console.log("Date range selected:", arg1);
                      return;
                    }
                  }}
                />

                {/* TIME PICKER */}
                <div className="p-3 border-t border-border">
                  {/* https://time.openstatus.dev */}

                  {/*  */}
                  {(mode === "single" || mode === undefined) && (
                    <div className="w-full justify-center flex">
                      <TimePickerDemo
                        setDate={field.onChange}
                        date={field.value}
                      />
                    </div>
                  )}

                  {/*  */}
                  {mode === "multiple" && (
                    <TimePickerDemo
                      setDate={(d) => {
                        //

                        if (!d) return;
                        if (!Array.isArray(field.value)) return;

                        const result: number = field.value.findIndex(
                          (item: Date) => isSameDay(d, item)
                        );

                        const ar = [
                          ...field.value.slice(0, result),
                          d,
                          ...field.value.slice(result + 1),
                        ];

                        field.onChange(ar);
                      }}
                      date={field.value?.[currentIndex]}
                    />
                  )}

                  {/*  */}
                  {mode === "range" && (
                    <div className="flex flex-col gap-2 items-center justify-between  ">
                      <TimePickerDemo
                        setDate={(d) =>
                          field.onChange({ ...field.value, from: d })
                        }
                        date={field?.value?.from}
                      />

                      <TimePickerDemo
                        setDate={(d) =>
                          field.onChange({ ...field.value, to: d })
                        }
                        date={field?.value?.to}
                      />
                    </div>
                  )}
                </div>
                {/*  */}
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

type RendererProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  mode: Mode | undefined;
};

type RendererType = <T extends FieldValues>(
  props: RendererProps<T>
) => JSX.Element;

const Renderer: RendererType = ({ mode, field }) => {
  //
  if (!field.value) return <div>{"Pick a date"}</div>;

  switch (mode) {
    case undefined:
    case "single":
      return (
        <div className="overflow-hidden truncate ">
          {isValid(field.value) ? (
            format(field.value, "PPP HH:mm:ss")
          ) : (
            <span>Invalid date</span> // fallback for invalid date
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
        <div className="overflow-hidden truncate ">
          {isValid(field.value.from) && isValid(field.value.to) ? (
            `${format(field.value.from, "PPP HH:mm:ss")} - ${format(field.value.to, "PPP HH:mm:ss")}`
          ) : (
            <span>Invalid date range</span>
          )}
        </div>
      );
  }

  return <></>;
};

const formatMultipleDates = (dates: Date[]): string => {
  //
  const monthYearFormatter = (d: Date) => format(d, "yy MMM");
  const dayFormatter = (d: Date) => parseInt(format(d, "dd"), 10);
  const timeFormatter = (d: Date) => format(d, "HH:mm:ss");

  return Array.from(
    dates.reduce<Map<string, Map<number, string[]>>>((acc, date) => {
      //

      const monthYear = monthYearFormatter(date);
      const day = dayFormatter(date);
      const time = timeFormatter(date);

      // month/year group
      const dayMap = acc.has(monthYear)
        ? acc.get(monthYear)!
        : acc.set(monthYear, new Map<number, string[]>()) &&
          acc.get(monthYear)!;

      // day group
      const times = dayMap.has(day)
        ? dayMap.get(day)!
        : dayMap.set(day, []) && dayMap.get(day)!;

      return (times.push(time), acc);
    }, new Map())
  )
    .map(
      ([monthYear, days]) =>
        `${monthYear} : ${Array.from(days)
          .map(([d, t]) => `${d} [ ${t.join(", ")} ]`)
          .join(", ")}`
    )
    .join(" & ");
};

type DateSelectPayload = Date | Date[] | DateRange;

// Type guard for DateRange
const isDateRange = (obj: DateSelectPayload): obj is DateRange => {
  return obj && "from" in obj && "to" in obj;
};

// Type guard for single Date
const isSingleDate = (obj: DateSelectPayload): obj is Date => {
  return obj instanceof Date;
};

// Type guard for array of Dates
const isMultipleDates = (obj: DateSelectPayload): obj is Date[] => {
  return Array.isArray(obj);
};

export { RHFDateTime };
export type { RHFDateTimeProps, RHFDateTimeType };
