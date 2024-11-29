import Header from "@/components/commons/Header";
import LeftToolbar from "@/components/commons/LeftToolbar";
import {cn} from "@/lib/utils";

const MainLayout = ({children}) => {
    return (
        <div className={cn("max-h-dvh max-w-dvh relative overflow-hidden")}>
            <Header/>
            <LeftToolbar/>
            <main className={cn("mt-[calc(var(--header-height))] ml-[calc(var(--left-toolbar-width))]",
                "h-[calc(100dvh-var(--header-height))]",
                "transition-all duration-300 overflow-auto"
            )}>
                {children}
            </main>
        </div>
    );
}

export default MainLayout;