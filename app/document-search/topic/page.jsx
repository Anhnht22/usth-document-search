"use client";

import {cn} from "@/lib/utils";
import DocumentSearchLayout from "@/components/commons/document-search/DocumentSearchLayout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import clientRoutes from "@/routes/client";
import {useRouter, useSearchParams} from "next/navigation";
import {useTopic} from "@/hook/useTopic";
import {useEffect, useState} from "react";
import ShowType from "@/app/document-search/ShowType";

const DocumentSearch = () => {
    const router = useRouter();
    const searchParams = useSearchParams()

    const subject_id = searchParams.get('subject_id')
    const department_id = searchParams.get('department_id')

    useEffect(() => {
        if (!subject_id) {
            if (department_id) {
                router.push(clientRoutes.documentSearch.listSubject.path + `?department_id=${department_id}`)
            } else {
                router.push(clientRoutes.documentSearch.listDepartment.path)
            }
        }
    }, [subject_id, department_id]);

    // {
    //     "topic_id": 14,
    //     "topic_name": "Top",
    //     "topic_active": 1,
    //     "subject_name": "Sub test 1",
    //     "subject_id": 17
    // }
    const {data: topicResp} = useTopic({
        limit: -999,
        active: 1,
        department_id: department_id,
        subject_id: subject_id,
        order: JSON.stringify({"t.topic_name": "asc"})
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
                        {topicResp?.data?.map((item) => {
                            const {topic_id, topic_name, description} = item;

                            return (
                                <Link
                                    key={topic_id}
                                    href={clientRoutes.documentSearch.list.path + `?department_id=${department_id}&subject_id=${subject_id}&topic_id=${topic_id}`}
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
                                                    <p className={cn("h-[40px] line-clamp-2 font-bold")}>{topic_name}</p>
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
                                                        className={cn("line-clamp-2 h-[28px]")}>{topic_name}</CardTitle>
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