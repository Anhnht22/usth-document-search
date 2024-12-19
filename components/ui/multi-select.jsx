/**
 * https://github.com/sersavan/shadcn-multi-select-component
 */

import * as React from "react";
import {useEffect} from "react";
import {cva} from "class-variance-authority";
import {CheckIcon, ChevronDown, Plus, WandSparkles, XCircle, XIcon} from "lucide-react";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Separator} from "@radix-ui/react-select";
import {useInView} from "react-intersection-observer";

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
    "",
    {
        variants: {
            variant: {
                default:
                    "border-foreground/10 text-foreground bg-card hover:bg-card/80",
                secondary:
                    "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                inverted: "inverted",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);


export const MultiSelect = React.forwardRef(
    (
        {
            value,
            options,
            onValueChange,
            variant,
            defaultValue = [],
            placeholder = "Select options",
            animation = 0,
            maxCount = 3,
            modalPopover = true,
            isMultiple = true,
            isCreate = false,
            CreateComponent = <></>,
            asChild = false,
            isClearable = true,
            className,
            loadMore,
            onFilter,
            onAsyncFilter,
            ...props
        },
        ref
    ) => {
        const [selectedValues, setSelectedValues] = React.useState(value || defaultValue);
        const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
        const [isAnimating, setIsAnimating] = React.useState(false);
        const [isCreating, setIsCreating] = React.useState(false);

        const {ref: inViewRef, inView} = useInView();

        useEffect(() => {
            if (value !== selectedValues) {
                setSelectedValues(value || []);  // Đồng bộ hóa giá trị khi có sự thay đổi từ ngoài
            }
        }, [value]);

        const handleInputKeyUp = (event) => {
            if (onFilter) {
                onFilter(event.currentTarget.value);
            } else if (event.key === "Enter") {
                setIsPopoverOpen(true);
            } else if (event.key === "Backspace" && !event.currentTarget.value) {
                const newSelectedValues = [...selectedValues];
                newSelectedValues.pop();
                setSelectedValues(newSelectedValues);
                onValueChange(newSelectedValues);
            }
        };

        const toggleOption = (option) => {
            let newSelectedValues;

            if (isMultiple) {
                // Cho phép chọn nhiều
                newSelectedValues = selectedValues.includes(option)
                    ? selectedValues.filter((value) => value !== option)
                    : [...selectedValues, option];
            } else {
                // Chỉ chọn một
                newSelectedValues = [option];
                setIsPopoverOpen(false);
            }

            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        };

        const handleClear = () => {
            setSelectedValues([]);
            onValueChange([]);
        };

        const handleTogglePopover = () => {
            setIsPopoverOpen((prev) => !prev);
        };

        const clearExtraOptions = () => {
            const newSelectedValues = selectedValues.slice(0, maxCount);
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        };

        const toggleAll = () => {
            if (selectedValues.length === options.length) {
                handleClear();
            } else {
                const allValues = options.map((option) => option.value);
                setSelectedValues(allValues);
                onValueChange(allValues);
            }
        };

        const onCreateInternal = () => {
            setIsCreating(true);
        }

        useEffect(() => {
            if (isPopoverOpen && inView && loadMore) loadMore()
        }, [inView, isPopoverOpen, loadMore])

        return (
            <Popover
                open={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
                modal={modalPopover}
            >
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        {...props}
                        onClick={handleTogglePopover}
                        className={cn(
                            "flex w-full py-1 pl-3 pr-1 shadow-none rounded-md border min-h-9",
                            "h-auto items-center justify-between bg-inherit",
                            "hover:bg-inherit [&_svg]:pointer-events-auto",
                            className,
                        )}
                    >
                        {selectedValues.length > 0 ? (
                            <div className={cn(
                                "flex justify-start items-center w-full relative flex-wrap gap-1.5",
                                isClearable ? "pr-16" : "pr-8"
                            )}>
                                {selectedValues.slice(0, maxCount).map((value) => {
                                    const option = options.find((o) => o.value === value);
                                    const IconComponent = option?.icon;
                                    return (
                                        <div key={value} className="max-w-full">
                                            <Badge
                                                key={value}
                                                className={cn(
                                                    isMultiple ? "" : "border-0 shadow-none font-medium p-0 text-sm",
                                                    isAnimating ? "animate-bounce" : "",
                                                    multiSelectVariants({variant}),
                                                    "max-w-full bg-transparent hover:bg-transparent",
                                                )}
                                                style={{animationDuration: `${animation}s`}}
                                            >
                                                {IconComponent && (
                                                    <IconComponent className="h-4 w-4 mr-2"/>
                                                )}
                                                <span
                                                    className={cn("truncate max-w-full text-start")}>{option?.label}</span>
                                                {isMultiple && (
                                                    <XCircle
                                                        className="ml-2 h-4 w-4 cursor-pointer"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            toggleOption(value);
                                                        }}
                                                    />
                                                )}
                                            </Badge>
                                        </div>
                                    );
                                })}
                                {selectedValues.length > maxCount && (
                                    <Badge
                                        className={cn(
                                            "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                                            isAnimating ? "animate-bounce" : "",
                                            multiSelectVariants({variant})
                                        )}
                                        style={{animationDuration: `${animation}s`}}
                                    >
                                        {`+ ${selectedValues.length - maxCount} more`}
                                        <XCircle
                                            className="ml-2 h-4 w-4 cursor-pointer"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                clearExtraOptions();
                                            }}
                                        />
                                    </Badge>
                                )}
                                <div className="flex items-center justify-between absolute right-0">
                                    {isClearable && (
                                        <XIcon
                                            className="h-4 mx-2 cursor-pointer text-muted-foreground"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleClear();
                                            }}
                                        />
                                    )}
                                    <Separator
                                        orientation="vertical"
                                        className="flex min-h-6 h-full"
                                    />
                                    <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground"/>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full mx-auto">
                                <span className="text-sm text-muted-foreground">
                                  {placeholder}
                                </span>
                                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2"/>
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="min-w-full p-0" align="start"
                    onEscapeKeyDown={() => setIsPopoverOpen(false)}
                >
                    <Command>
                        <CommandInput placeholder="Search..." onKeyUp={handleInputKeyUp}/>
                        {isCreate && (
                            isCreating
                                ? CreateComponent
                                : (
                                    <CommandItem key="create" onSelect={onCreateInternal}
                                                 className="cursor-pointer">
                                        <div className={cn("mr-2 flex h-4 w-4 items-center justify-center")}>
                                            <Plus className="h-4 w-4"/>
                                        </div>
                                        <span>Create</span>
                                    </CommandItem>
                                )
                        )}
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {isMultiple && (
                                    <CommandItem key="all" onSelect={toggleAll} className="cursor-pointer">
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                selectedValues.length === options.length
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <CheckIcon className="h-4 w-4"/>
                                        </div>
                                        <span>(Select All)</span>
                                    </CommandItem>
                                )}
                                {options.map((option, index) => {
                                    const isSelected = selectedValues.includes(option.value);
                                    return (
                                        <CommandItem
                                            ref={index === options.length - 1 ? inViewRef : null}
                                            key={option.value}
                                            onSelect={() => toggleOption(option.value)}
                                            className={cn("cursor-pointer")}
                                        >
                                            {isMultiple && (
                                                <div
                                                    className={cn(
                                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                        isSelected
                                                            ? "bg-primary text-primary-foreground"
                                                            : "opacity-50 [&_svg]:invisible"
                                                    )}
                                                >
                                                    <CheckIcon className="h-4 w-4"/>
                                                </div>
                                            )}

                                            <div className={cn("flex-1")}>
                                                {option.icon && (
                                                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground"/>
                                                )}

                                                <span>{option.label}</span>
                                            </div>

                                            {!isMultiple && isSelected && (
                                                <div className={cn("ml-2 flex h-4 w-4 items-center justify-center")}>
                                                    <CheckIcon className="h-4 w-4"/>
                                                </div>
                                            )}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
                {animation > 0 && selectedValues.length > 0 && (
                    <WandSparkles
                        className={cn(
                            "cursor-pointer my-2 text-foreground bg-background w-3 h-3",
                            isAnimating ? "" : "text-muted-foreground"
                        )}
                        onClick={() => setIsAnimating(!isAnimating)}
                    />
                )}
            </Popover>
        );
    }
);

MultiSelect.displayName = "MultiSelect";