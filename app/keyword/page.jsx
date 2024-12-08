"use client";

import MainLayout from "@/components/commons/MainLayout";
import {cn} from "@/lib/utils";
import {Typography} from "@/components/ui/typography";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CheckCircle2, XCircle} from "lucide-react";
import {useState} from "react";
import {omit} from "lodash";
import {Pagination} from "@/components/ui-custom/Pagination";
import TopicSearchForm from "@/app/topic/TopicSearchForm";
import {useKeyword} from "@/hook/useKeyword";

const ListUser = () => {
    const [page, setPage] = useState(1);

    const [filter, setFilter] = useState({});

    const {data: listDataResp} = useKeyword({
        limit: 20,
        page: page,
        order: JSON.stringify({"t.keyword_id": "desc"}),
        ...(filter.active === "all" ? omit(filter, "active") : filter)
    });
    const {data: listData, total: totalData} = listDataResp || {};
    const {total, limits, pages} = totalData || {};

    return (
        <MainLayout>
            <div className={cn("flex gap-3 h-full")}>
                <div className="flex-1 py-3 pl-3 flex flex-col h-full">
                    <div className={cn("flex justify-between")}>
                        <Typography variant="h2" className={cn("mb-4")}>Keyword</Typography>
                        <div className={cn("space-x-3")}>
                            {/*<CreateTopicDialog/>*/}
                        </div>
                    </div>
                    <div className={cn("flex-1 overflow-auto")}>
                        <Table>
                            <TableCaption>List of keyword in the organization</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={cn("w-20")}>ID</TableHead>
                                    <TableHead className={cn("min-w-[300px]")}>Keyword</TableHead>
                                    <TableHead className={cn("w-32 text-center")}>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listData?.map((item) => {
                                    const {keyword_id, keyword, active} = item;
                                    return (
                                        <TableRow key={keyword_id}>
                                            <TableCell>{keyword_id}</TableCell>
                                            <TableCell>{keyword}</TableCell>
                                            <TableCell>
                                                <div className={cn("flex justify-center")}>
                                                    {active
                                                        ? <CheckCircle2 className="text-green-500"/>
                                                        : <XCircle className="text-red-500"/>
                                                    }
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <div>
                        {total ? <Pagination
                            totalRecord={total}
                            perPage={limits}
                            page={pages}
                            onPageChange={setPage}
                        /> : null}
                    </div>
                </div>

                <TopicSearchForm onChangeFilter={setFilter}/>
            </div>
        </MainLayout>
    );
}

export default ListUser;
