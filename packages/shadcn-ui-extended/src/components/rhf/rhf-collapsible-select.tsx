import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";
import { useMemo } from "react";

import type { ComponentProps, JSX, ReactNode } from "react";
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

type RHFCommandItemProps = ComponentProps<typeof SelectItem>;

type RHFCustomDataPoint = RHFCommandItemProps & {
  label: string;
  leading?: ReactNode;
  value: string;
};

type RHFCollapsibleComboBoxGroup = {
  label: string;
  items:
    | RHFCollapsibleComboBoxDataPoint[]
    | Readonly<RHFCollapsibleComboBoxDataPoint[]>;
};

type RHFCollapsibleComboBoxDataPoint = {
  kids?: RHFCustomDataPoint[] | Readonly<RHFCustomDataPoint[]>;
} & RHFCustomDataPoint;

type RHFCollapsibleComboBoxProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;

  data: RHFCollapsibleComboBoxGroup[] | Readonly<RHFCollapsibleComboBoxGroup[]>;

  readOnly?: boolean;
  disabled?: boolean;

  label?: string;
  placeholder?: string;
  description?: string;
  empty?: string;
};

type RHFCollapsibleComboBoxType = <T extends FieldValues>(
  props: RHFCollapsibleComboBoxProps<T>
) => JSX.Element;

const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

const RHFCollapsibleSelect: RHFCollapsibleComboBoxType = ({
  control,
  data,
  name,
  description,
  label,
  placeholder,
  disabled,
  readOnly,
  empty,
}) => {
  //

  //
  const labelMap = useMemo(() => {
    const lookupMap: Record<string, string> = {};

    //
    for (let i = 0; i < data.length; i++) {
      const group = data[i];

      if (!group) continue;

      for (let k = 0; k < group.items.length; k++) {
        const point = group.items[k];

        if (!point) continue;

        lookupMap[point.value] = point.label;

        if (point.kids) {
          for (let j = 0; j < point.kids.length; j++) {
            const kid = point.kids[j];

            if (kid) {
              lookupMap[kid.value] = kid.label;
            }
          }
        }
      }

      //
    }

    return lookupMap;
  }, [data]);

  const isParentSelected = <T extends FieldValues>(
    point: RHFCollapsibleComboBoxDataPoint,
    fieldValue: ControllerRenderProps<T, Path<T>>["value"]
  ) => {
    const kids = point.kids || [];
    return (
      fieldValue === point.value || kids.some((kid) => kid.value === fieldValue)
    );
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        //

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select
              {...field}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger ref={field.ref}>
                  {labelMap[field.value] || placeholder}
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {data?.map((group) => (
                  <SelectGroup key={group.label}>
                    {group.label && <SelectLabel>{group.label}</SelectLabel>}
                    {group?.items?.map((data, index) => {
                      //
                      const kids = data?.kids;
                      const hasKids = Array.isArray(kids) && kids?.length > 0;
                      const isSelected = isParentSelected(data, field.value);

                      return hasKids ? (
                        <Collapsible key={index} defaultOpen={isSelected}>
                          <div className="flex items-center">
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-between gap-2 px-2 py-1"
                                onClick={stopPropagation}
                              >
                                <Check
                                  className={clsx("mr-2 size-4  shrink-0", {
                                    hidden: !isSelected,
                                  })}
                                />
                                <span className="truncate">{data.label}</span>{" "}
                                <ChevronDown className="h-5 w-5 shrink-0" />{" "}
                                <span className="sr-only">Toggle section</span>
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent className="mt-1 flex flex-col gap-1 pl-7">
                            {kids?.map((child, childIndex) => (
                              <SelectItem
                                key={`${child.value}-${childIndex}`}
                                value={child.value}
                                className="py-1"
                              >
                                {child.label}
                              </SelectItem>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <SelectItem key={data.value} value={data.value}>
                          {data.label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export { RHFCollapsibleSelect };
export type {
  RHFCollapsibleComboBoxDataPoint,
  RHFCollapsibleComboBoxProps,
  RHFCollapsibleComboBoxType,
};
