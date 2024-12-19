"use client";

import {cn} from "@/lib/utils";
import DocumentSearchLayout from "@/components/commons/document-search/DocumentSearchLayout";
import {useDepartments} from "@/hook/useDepartments";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import clientRoutes from "@/routes/client";
import ShowType from "@/app/document-search/ShowType";
import {useState} from "react";

const DocumentSearch = () => {
    const {data: departmentResp} = useDepartments({
        limit: -999,
        active: 1,
        order: JSON.stringify({"t.department_name": "asc"})
    });

    const [viewType, setViewType] = useState('grid');

    return (
        <DocumentSearchLayout>
            <div className={cn("flex h-full")}>
                <div className="flex-1 py-3 flex flex-col h-full overflow-auto">
                    <div className={cn("px-4 py-2 flex justify-end gap-2")}>
                        <ShowType onChange={setViewType} defaultValue={viewType}/>
                    </div>
                    <div
                        className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4")}>
                        {departmentResp?.data?.map((item) => {
                            const {department_id, department_name, description} = item;

                            return (
                                <Link
                                    key={department_id}
                                    href={clientRoutes.documentSearch.listSubject.path + `?department_id=${department_id}`}
                                    className={cn(
                                        "text-sm font-medium flex items-center gap-2",
                                        viewType !== "row" && "h-[200px]"
                                    )}
                                >
                                    {viewType === "row"
                                        ? (
                                            <Card
                                                className={cn(
                                                    "flex items-start px-3 py-2 gap-3 w-full",
                                                    "hover:scale-[1.02] hover:shadow-md hover:cursor-pointer transition"
                                                )}
                                            >
                                                <div>
                                                    <p className={cn("h-[40px] line-clamp-2 font-bold")}>{department_name}</p>
                                                    <p className={cn("h-[60px] text-sm line-clamp-3")}>{description}</p>
                                                </div>
                                            </Card>
                                        ) : (
                                            <Card
                                                className={cn(
                                                    "hover:scale-[1.02] hover:shadow-md",
                                                    "w-full transition h-full",
                                                )}
                                            >
                                                <CardHeader>
                                                    <CardTitle
                                                        className={cn("line-clamp-2 h-[28px]")}>{department_name}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <span className={cn("text-sm line-clamp-5")}>{description}</span>
                                                </CardContent>
                                            </Card>
                                        )
                                    }
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </DocumentSearchLayout>
    )
}

export default DocumentSearch;