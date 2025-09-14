import { useMultiCollapsibleCombo as useMultiCombo } from "@repo/shadcn-ui-extended/hooks/use-multi-collapsible-combo";
import { Button } from "@repo/shadcn-ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/shadcn-ui/components/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/shadcn-ui/components/command";
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
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useMemo } from "react";

import type {
  Callbacks,
  DataLifeCycle,
  RestrictKeys,
  RHFMultiCollapsibleComboBoxItem,
} from "@repo/shadcn-ui-extended/hooks/use-multi-collapsible-combo";
import type { JSX } from "react";
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

type RHFMultiCollapsibleComboBoxProps<
  T extends FieldValues,
  TSafety extends boolean = true,
> = {
  name: RestrictKeys<Path<T>, T, TSafety>;
  control: Control<T>;

  safety?: TSafety;

  readOnly?: boolean;
  disabled?: boolean;
  hasSearch?: boolean;

  label?: string;
  placeholder?: string;
  searchholder?: string;
  description?: string;
  empty?: string;

  //
} & DataLifeCycle;

type RHFMultiCollapsibleComboBoxType = <
  T extends FieldValues,
  TSafety extends boolean = true,
>(
  props: RHFMultiCollapsibleComboBoxProps<T, TSafety>
) => JSX.Element;

const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

const RHFMultiCollapsibleComboBox: RHFMultiCollapsibleComboBoxType = ({
  control,

  name,
  description,
  label,
  safety,
  disabled,
  readOnly,
  placeholder,
  searchholder,
  empty,
  hasSearch = true,

  ...payload
}) => {
  //

  const [data, getters, predicates] = useMultiCombo(payload);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover modal={true}>
            <PopoverTrigger ref={field.ref} asChild>
              <FormControl>
                <Button
                  disabled={disabled}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[250px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <p className="overflow-hidden truncate">
                    {field.value?.length
                      ? getters.getSelectedLabels(field.value)?.join(", ")
                      : placeholder}
                  </p>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="max-w-[250px] p-0">
              <Command>
                {hasSearch && (
                  <CommandInput
                    readOnly={readOnly}
                    placeholder={searchholder}
                    className="h-9"
                  />
                )}
                <CommandList>
                  <CommandEmpty>{empty}</CommandEmpty>
                  {data.groups.map(({ itemIds, label }, index) => (
                    <CommandGroup key={index} heading={label}>
                      {itemIds.map((id) => {
                        const item = data.items[id];
                        if (!item) return;
                        // if (item.parentId) return;

                        return (
                          <ComboItemComponent
                            key={id}
                            item={item}
                            {...getters}
                            {...predicates}
                            onChange={field.onChange}
                            fieldValue={field.value}
                            depth={0}
                            keywords={[]}
                          />
                        );
                      })}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// ---
type ComboItemComponentProps<T extends FieldValues> = {
  fieldValue: ControllerRenderProps<T, Path<T>>["value"];
  depth?: number;
  keywords: string[];

  item: RHFMultiCollapsibleComboBoxItem;
  onChange: (...event: unknown[]) => void;
} & Omit<Callbacks, "getSelectedLabels">;

const ComboItemComponent = <T extends FieldValues>({
  item,
  getChildrenItems,
  getDescendantsKeywords,
  isAnyDescendantSelected,
  isLeafSelected,
  onChange,
  fieldValue,
  depth = 0,
}: ComboItemComponentProps<T>) => {
  //

  const children = useMemo(
    () => (item.hasChildren ? getChildrenItems(item.id) : []),
    [item.hasChildren, item.id, getChildrenItems]
  );

  const hasChildren = useMemo(() => children.length > 0, [children]);

  const selected = useMemo(() => {
    //
    if (item.hasChildren) {
      return isAnyDescendantSelected(item.id, fieldValue);
    }

    return isLeafSelected(item.id, fieldValue);
  }, [
    item.hasChildren,
    item.id,
    isLeafSelected,
    fieldValue,
    isAnyDescendantSelected,
  ]);

  const keywords = useMemo(() => {
    return getDescendantsKeywords(item.id);
  }, [getDescendantsKeywords, item.id]);

  const handleSelect = useCallback(
    (item: RHFMultiCollapsibleComboBoxItem) => {
      if (item.hasChildren) return;
      if (!item.value) return;

      const set = new Set<string>(fieldValue || []);

      if (set.has(item.value)) {
        set.delete(item.value);
        return onChange([...set]);
      }

      set.add(item.value);
      onChange([...set]);
    },
    [fieldValue, onChange]
  );

  return (
    <CommandItem
      value={item.value || item.id}
      keywords={keywords}
      onSelect={() => item.isSelectable && handleSelect(item)}
      className={clsx({ "ml-2": depth > 0 })}
      spellCheck={true}
    >
      {hasChildren ? (
        <Collapsible
          defaultOpen={false}
          className="w-full space-y-2 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {<Check className={clsx("pr-2", { hidden: !selected })} />}
              {item.leading}
              <div className="text-content-standard">{item.label}</div>
            </div>
            <CollapsibleTrigger
              className="data-[state=open]:rotate-180 "
              asChild
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-fit h-5"
                onClick={stopPropagation}
              >
                <ChevronDown className="w-[24px] h-[24px]" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent
            onClick={stopPropagation}
            className="text-popover-foreground outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            {children.map((child) => (
              <ComboItemComponent
                key={child.id}
                item={child}
                getChildrenItems={getChildrenItems}
                isAnyDescendantSelected={isAnyDescendantSelected}
                isLeafSelected={isLeafSelected}
                onChange={onChange}
                getDescendantsKeywords={getDescendantsKeywords}
                fieldValue={fieldValue}
                depth={depth + 1}
                keywords={[]}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="flex items-center">
          {item.isSelectable && (
            <Check className={clsx("pr-2", { hidden: !selected })} />
          )}
          {item.leading}
          <div className="text-content-standard">{item.label}</div>
        </div>
      )}
    </CommandItem>
  );
};

export { RHFMultiCollapsibleComboBox };
export type {
  RHFMultiCollapsibleComboBoxProps,
  RHFMultiCollapsibleComboBoxType,
};
