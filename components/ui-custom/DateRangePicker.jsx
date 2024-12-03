import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {ddMMyyyy} from "@/utils/common";
import {CalendarIcon, X} from "lucide-react";
import {DateRangePicker as DateRangePickerReactDate} from 'react-date-range';
import {useEffect, useState} from "react";

const DateRangePicker = ({value = {}, onChange}) => {
    const [dateRange, setDateRange] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (onChange && dateRange) onChange(dateRange)
    }, [dateRange]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        (!dateRange || !dateRange.startDate || !dateRange.endDate) && "text-muted-foreground"
                    )}
                    title={
                        dateRange && dateRange.startDate && dateRange.endDate
                            ? `${format(dateRange.startDate, ddMMyyyy)} - ${format(dateRange.endDate, ddMMyyyy)}`
                            : "Pick a date range"
                    }
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    <p className={cn("w-full overflow-hidden whitespace-nowrap text-ellipsis")}>
                        {dateRange && dateRange.startDate && dateRange.endDate ? (
                            `${format(dateRange.startDate, ddMMyyyy)} - ${format(dateRange.endDate, ddMMyyyy)}`
                        ) : (
                            "Pick a date range"
                        )}
                    </p>
                    {dateRange && dateRange.startDate && dateRange.endDate && (
                        <span
                            className={cn(
                                "ml-auto h-6 w-6 items-center",
                                isHovered ? "flex" : "hidden"
                            )}
                            onClick={(e) => {
                                e.stopPropagation()
                                setDateRange(null)
                            }}
                        >
                            <X className="h-4 w-4"/>
                            <span className="sr-only">Clear date</span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <DateRangePickerReactDate
                    ranges={[dateRange || {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }]}
                    onChange={(range) => {
                        const {selection} = range;
                        setDateRange(selection);
                    }}
                    moveRangeOnFirstSelection={false}
                    showDateDisplay={false}
                    staticRanges={[]}
                    inputRanges={[]}
                />
            </PopoverContent>
        </Popover>
    )
}

export default DateRangePicker;