import {cn} from "@/lib/utils";
import DocumentSearchLeftToolbar from "@/components/commons/document-search/DocumentSearchLeftToolbar";
import DocumentSearchHeader from "@/components/commons/document-search/DocumentSearchHeader";

const MainLayout = ({children}) => {
    return (
        <div className={cn("max-h-dvh max-w-dvh relative overflow-hidden")}>
            <DocumentSearchHeader/>
            <DocumentSearchLeftToolbar/>
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