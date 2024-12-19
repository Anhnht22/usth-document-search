"use client";

import MainLayout from "@/components/commons/MainLayout";
import {cn} from "@/lib/utils";
import {Typography} from "@/components/ui/typography";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CheckCircle2, EllipsisVertical, LockKeyhole, Pencil, Plus, Trash2, XCircle} from "lucide-react";
import {useEffect, useState} from "react";
import {omit} from "lodash";
import {Pagination} from "@/components/ui-custom/Pagination";
import TopicSearchForm from "@/app/topic/TopicSearchForm";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {useTopic} from "@/hook/useTopic";
import DeactivateTopicDialog from "@/app/topic/DeactivateTopicDialog";
import DeleteTopicDialog from "@/app/topic/DeleteTopicDialog";
import Link from "next/link";
import clientRoutes from "@/routes/client";
import {Badge} from "@/components/ui/badge";

const ListTopic = () => {
    const [page, setPage] = useState(1);

    const [filter, setFilter] = useState({});

    const [selectedItem, setSelectedItem] = useState(null);

    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
    const [isOpenDeactivateDialog, setIsOpenDeactivateDialog] = useState(false);
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

    const {data: listDataResp} = useTopic({
        limit: 20,
        page: page,
        order: JSON.stringify({"t.topic_id": "desc"}),
        ...(filter.active === "all" ? omit(filter, "active") : filter)
    });
    const {data: listData, total: totalData} = listDataResp || {};
    const {total, limits, pages} = totalData || {};

    useEffect(() => {
        if (!isOpenUpdateDialog && !isOpenDeactivateDialog && !isOpenDeleteDialog) {
            setSelectedItem(null);
        }
    }, [isOpenUpdateDialog, isOpenDeactivateDialog, isOpenDeleteDialog]);

    return (
        <MainLayout>
            <div className={cn("flex gap-3 h-full")}>
                <div className="flex-1 py-3 pl-3 flex flex-col h-full">
                    <div className={cn("flex justify-between")}>
                        <Typography variant="h2" className={cn("mb-4")}>Topic</Typography>
                        <div className={cn("space-x-3")}>
                            <Button asChild>
                                <Link href={clientRoutes.topic.create.path}>
                                    <Plus/> Create
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className={cn("flex-1 overflow-auto")}>
                        <Table>
                            <TableCaption>List of topic in the organization</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={cn("w-20")}>ID</TableHead>
                                    <TableHead className={cn("max-w-[200px]")}>Name</TableHead>
                                    <TableHead className={cn("max-w-[300px]")}>Description</TableHead>
                                    <TableHead className={cn("max-w-[300px]")}>Subject name</TableHead>
                                    <TableHead className={cn("w-32 text-center")}>Status</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listData?.map((item, index) => {
                                    const {topic_id, topic_name, description, active, subject} = item;
                                    return (
                                        <TableRow key={topic_id}>
                                            <TableCell>{(page - 1) * limits + index + 1}</TableCell>
                                            <TableCell>{topic_name}</TableCell>
                                            <TableCell>{description}</TableCell>
                                            <TableCell>
                                                <div
                                                    className={cn("flex gap-1.5 p-1 flex-wrap")}
                                                >
                                                    {subject.map(({subject_id, subject_name}, i) => i < 2 && (
                                                        <Badge
                                                            key={subject_id}
                                                        >
                                                            <span
                                                                className={cn("truncate max-w-[200px]")}>{subject_name}</span>
                                                        </Badge>
                                                    ))}

                                                    {subject.length - 2 > 0 && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost"
                                                                        className="p-3 border border-[#ccc] rounded bg-[#f0f0f0f] h-0 w-0">
                                                                    <span>+{subject.length - 2}</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {subject.map((item, i) => {
                                                                    const {subject_id, subject_name} = item;

                                                                    return i >= 2 && (
                                                                        <DropdownMenuItem key={subject_id}>
                                                                            {subject_name}
                                                                        </DropdownMenuItem>
                                                                    )
                                                                })}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className={cn("flex justify-center")}>
                                                    {active
                                                        ? <CheckCircle2 className="text-green-500"/>
                                                        : <XCircle className="text-red-500"/>
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu modal={false}>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <EllipsisVertical className="h-4 w-4"/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                            className={cn("hover:cursor-pointer")}
                                                        >
                                                            <Link
                                                                href={clientRoutes.topic.update.path.replace(":id", topic_id)}>
                                                                <Pencil/> Update
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className={cn("hover:cursor-pointer")}
                                                            onClick={() => {
                                                                setSelectedItem(item);
                                                                setIsOpenDeactivateDialog(true)
                                                            }}
                                                        >
                                                            <LockKeyhole/> {active ? "Deactivate" : "Activate"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className={cn("hover:cursor-pointer")}
                                                            onClick={() => {
                                                                setSelectedItem(item);
                                                                setIsOpenDeleteDialog(true)
                                                            }}
                                                        >
                                                            <Trash2/> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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

            {/*<UpdateTopicDialog*/}
            {/*    selectedItem={selectedItem}*/}
            {/*    isOpen={isOpenUpdateDialog}*/}
            {/*    onOpenChange={setIsOpenUpdateDialog}*/}
            {/*/>*/}

            <DeactivateTopicDialog
                selectedItem={selectedItem}
                isOpen={isOpenDeactivateDialog}
                onOpenChange={setIsOpenDeactivateDialog}
            />

            <DeleteTopicDialog
                selectedItem={selectedItem}
                isOpen={isOpenDeleteDialog}
                onOpenChange={setIsOpenDeleteDialog}
            />
        </MainLayout>
    );
}

export default ListTopic;
