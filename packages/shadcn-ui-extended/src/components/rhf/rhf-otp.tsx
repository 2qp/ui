import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Fragment, useMemo } from "react";

import type { ComponentPropsWithoutRef, JSX } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

// see .vscode tw attributes
type RHFOTPStyles = {
  inputOTPClassName?: string;
  inputOTPGroupClassName?: string;
  inputOTPSlotClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

type RHFOTPConfig = Omit<
  ComponentPropsWithoutRef<typeof InputOTP>,
  | "onChange"
  | "name"
  | "maxLength"
  | "readOnly"
  | "disabled"
  | "placeholder"
  | "className"
  | "render"
>;

type RHFOTPGroup = {
  slots: number;
  separator: boolean;
};

type RHFOTPStructure = RHFOTPGroup[];

type RHFOTPProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;

  readOnly?: boolean;
  disabled?: boolean;

  config?: RHFOTPConfig;
  length?: number;
  structure?: RHFOTPStructure;

  label?: string;
  placeholder?: string;
  description?: string;

  styles?: RHFOTPStyles;
};

type RHFOTPType = <T extends FieldValues>(props: RHFOTPProps<T>) => JSX.Element;

const RHFOTP: RHFOTPType = ({
  control,
  name,
  description,
  label,
  placeholder,
  styles,
  config,
  disabled = false,
  readOnly = false,
  length = 6,
  structure = [{ separator: false, slots: 6 }],
}) => {
  //

  // precompute
  const startIndices = useMemo(() => {
    return structure.reduce<number[]>((acc, group, index) => {
      acc[index] =
        index === 0
          ? 0
          : (acc[index - 1] ?? 0) + (structure[index - 1]?.slots ?? 0);
      return acc;
    }, []);
  }, [structure]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={styles?.labelClassName}>{label}</FormLabel>
          <FormControl>
            <InputOTP
              maxLength={length}
              {...field}
              readOnly={readOnly}
              disabled={disabled}
              placeholder={placeholder}
              className={styles?.inputOTPClassName}
              {...config}
            >
              {structure.map((group, groupIndex) => {
                //

                const startIndex = startIndices[groupIndex];

                return (
                  <Fragment key={groupIndex}>
                    <InputOTPGroup className={styles?.inputOTPGroupClassName}>
                      {Array.from({ length: group.slots }).map((_, index) => {
                        //

                        if (startIndex === undefined) return;

                        const slotIndex = startIndex + index;

                        return (
                          <InputOTPSlot
                            className={styles?.inputOTPSlotClassName}
                            key={"slot" + index}
                            index={slotIndex}
                          />
                        );
                      })}
                    </InputOTPGroup>

                    {group.separator && <InputOTPSeparator />}
                  </Fragment>
                );
              })}
            </InputOTP>
          </FormControl>
          <FormDescription className={styles?.descriptionClassName}>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { RHFOTP };
export type { RHFOTPProps, RHFOTPType };
