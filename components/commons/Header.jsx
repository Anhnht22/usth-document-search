import {CircleUser} from "lucide-react";
import {cn} from "@/lib/utils";

const Header = () => {
    return (
        <header
            className={cn("fixed left-[var(--left-toolbar-width)] top-0 transition-all duration-300",
                "h-[var(--header-height)] w-[calc(100dvw-var(--left-toolbar-width))]",
                "bg-white shadow flex justify-center items-center px-8 py-4"
            )}>
            <div className="flex-1"></div>
            <div>
                <CircleUser width={30} height={30}/>
            </div>
        </header>
    );
}

export default Header;