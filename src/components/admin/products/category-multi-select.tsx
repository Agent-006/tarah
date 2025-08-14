"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Tag, Folder, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CategoryOption {
  value: string;
  label: string;
  description?: string;
  parent?: string;
  featured?: boolean;
}

interface CategoryMultiSelectProps {
  options: CategoryOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function CategoryMultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select categories...",
  className,
}: CategoryMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  // Group categories by parent
  const groupedOptions = React.useMemo(() => {
    const parentCategories = options.filter((option) => !option.parent);
    const childCategories = options.filter((option) => option.parent);

    const grouped: { [key: string]: CategoryOption[] } = {};

    // Add root categories
    grouped["Root Categories"] = parentCategories;

    // Group child categories by parent
    childCategories.forEach((option) => {
      if (option.parent) {
        if (!grouped[option.parent]) {
          grouped[option.parent] = [];
        }
        grouped[option.parent].push(option);
      }
    });

    return grouped;
  }, [options]);

  const selectedOptions = options.filter((option) =>
    selected.includes(option.value)
  );

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-[40px]"
          >
            <div className="flex gap-1 flex-wrap max-w-full">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant={option.featured ? "default" : "outline"}
                    className="text-xs"
                  >
                    {option.parent && <Folder className="w-3 h-3 mr-1" />}
                    {option.label.split(" → ").pop()}
                    {option.featured && <Tag className="w-3 h-3 ml-1" />}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>No categories found.</CommandEmpty>
            <div className="max-h-[300px] overflow-auto">
              {Object.entries(groupedOptions).map(
                ([groupName, groupOptions], index) => (
                  <React.Fragment key={groupName}>
                    {index > 0 && <Separator />}
                    <CommandGroup heading={groupName}>
                      {groupOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => handleSelect(option.value)}
                          className="flex items-center gap-2 py-2"
                        >
                          <Check
                            className={cn(
                              "h-4 w-4",
                              selected.includes(option.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "font-medium",
                                    option.featured && "text-primary"
                                  )}
                                >
                                  {option.parent
                                    ? option.label.split(" → ").pop()
                                    : option.label}
                                </span>
                                {option.featured && (
                                  <Tag className="h-3 w-3 text-primary" />
                                )}
                              </div>
                              {option.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {option.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </React.Fragment>
                )
              )}
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
