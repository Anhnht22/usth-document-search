"use client"

import {cn} from "@/lib/utils";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import DepartmentView from "@/app/DepartmentView";
import SubjectView from "@/app/SubjectView";

const MasterBoard = () => {
    return (
        <div className={cn("py-3 px-3 h-full")}>
            <ResizablePanelGroup
                direction="horizontal"
                className="rounded-lg border w-full h-full"
            >
                <ResizablePanel defaultSize={50}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={50}>
                            <DepartmentView/>
                        </ResizablePanel>
                        <ResizableHandle/>
                        <ResizablePanel defaultSize={50}>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizableHandle/>
                <ResizablePanel defaultSize={50}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={50}>
                            <SubjectView/>
                        </ResizablePanel>
                        <ResizableHandle/>
                        <ResizablePanel defaultSize={50}>
                            <div className="flex h-full items-center justify-center p-6">
                                <span className="font-semibold">Three</span>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default MasterBoard;