import {Toggle} from "@/components/ui/toggle";
import {Columns2, LayoutGrid} from "lucide-react";
import {useEffect, useState} from "react";

const ShowType = ({onChange, defaultValue}) => {
    const [viewType, setViewType] = useState(defaultValue || "grid");

    useEffect(() => {
        if (onChange) onChange(viewType)
    }, [viewType]);

    return (
        <>
            <Toggle
                size="lg"
                aria-label="Grid view"
                pressed={viewType === "grid"}
                onPressedChange={() => setViewType("grid")}
            >
                <LayoutGrid className="h-4 w-4"/>
            </Toggle>
            <Toggle
                size="lg"
                aria-label="Row view"
                pressed={viewType === "row"}
                onPressedChange={() => setViewType("row")}
            >
                <Columns2 className="h-4 w-4"/>
            </Toggle>
        </>
    )
}

export default ShowType;