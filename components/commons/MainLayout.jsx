import Header from "@/components/commons/Header";
import LeftToolbar from "@/components/commons/LeftToolbar";
import {cn} from "@/lib/utils";

const MainLayout = ({children}) => {
    return (
        <>
            <Header/>
            <LeftToolbar/>
            <main className={cn("mt-[calc(var(--header-height))] ml-[calc(var(--left-toolbar-width))] py-3 px-3",
                "h-[calc(100dvh-var(--header-height))] transition-all duration-300",
            )}>
                {children}
            </main>
        </>
    );
}

export default MainLayout;