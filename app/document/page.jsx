"use client";

import MainLayout from "@/components/commons/MainLayout";
import {cn} from "@/lib/utils";
import {Typography} from "@/components/ui/typography";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CheckCircle2, EllipsisVertical, ExternalLink, LockKeyhole, Pencil, Trash2, XCircle} from "lucide-react";
import {Pagination} from "@/components/ui-custom/Pagination";
import {useEffect, useState} from "react";
import {useDocument} from "@/hook/useDocument";
import {convertUnixDate, ddMMyyyy} from "@/utils/common";
import DocumentSearchForm from "@/app/document/DocumentSearchForm";
import CreateDocumentDialog from "@/app/document/CreateDocumentDialog";
import envConfig from "@/utils/envConfig";
import UpdateDocumentDialog from "@/app/document/UpdateDocumentDialog";
import DeactivateDocumentDialog from "@/app/document/DeactivateDocumentDialog";
import DeleteDocumentDialog from "@/app/document/DeleteDocumentDialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";

const Document = () => {
    const [page, setPage] = useState(1);

    const [filter, setFilter] = useState({});

    const [selectedItem, setSelectedItem] = useState(null);

    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
    const [isOpenDeactivateDialog, setIsOpenDeactivateDialog] = useState(false);
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

    const {data: listDataResp} = useDocument({
        limit: 20,
        page: page,
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
                        <Typography variant="h2" className={cn("mb-4")}>Department</Typography>
                        <div className={cn("space-x-3")}>
                            <CreateDocumentDialog/>
                        </div>
                    </div>
                    <div className={cn("flex-1 overflow-auto")}>
                        <Table>
                            <TableCaption>List of departments in the organization</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={cn("w-20")}>ID</TableHead>
                                    <TableHead className={cn("min-w-[150px]")}>Topic</TableHead>
                                    <TableHead className={cn("w-[250px]")}>Title</TableHead>
                                    <TableHead className={cn("w-[300px]")}>Description</TableHead>
                                    <TableHead className={cn("min-w-[300px]")}>File path</TableHead>
                                    <TableHead className={cn("min-w-36")}>Created by</TableHead>
                                    <TableHead className={cn("w-60")}>Created date</TableHead>
                                    <TableHead className={cn("w-32 text-center")}>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listData?.map((item) => {
                                    const {
                                        document_id, file_path, title, description, upload_date,
                                        document_active, username, topic_name
                                    } = item;
                                    const uploadString = convertUnixDate(upload_date / 1000, ddMMyyyy);

                                    return (
                                        <TableRow key={document_id}>
                                            <TableCell>{document_id}</TableCell>
                                            <TableCell>{topic_name}</TableCell>
                                            <TableCell>{title}</TableCell>
                                            <TableCell>{description}</TableCell>
                                            <TableCell>
                                                {file_path.split('/').pop()}
                                                <a href={envConfig.endPointStatic + "/" + file_path} target="_blank">
                                                    <ExternalLink className={cn("w-5 h-5 inline ml-2")}/>
                                                </a>
                                            </TableCell>
                                            <TableCell>{username}</TableCell>
                                            <TableCell>{uploadString}</TableCell>
                                            <TableCell>
                                                <div className={cn("flex justify-center")}>
                                                    {document_active ? (
                                                        <CheckCircle2 className="text-green-500"/>
                                                    ) : (
                                                        <XCircle className="text-red-500"/>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <EllipsisVertical className="h-4 w-4"/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className={cn("hover:cursor-pointer")}
                                                            onClick={() => {
                                                                setSelectedItem(item);
                                                                setIsOpenUpdateDialog(true)
                                                            }}
                                                        >
                                                            <Pencil/> Update
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className={cn("hover:cursor-pointer")}
                                                            onClick={() => {
                                                                setSelectedItem(item);
                                                                setIsOpenDeactivateDialog(true)
                                                            }}
                                                        >
                                                            <LockKeyhole/> {document_active ? "Deactivate" : "Activate"}
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

                <DocumentSearchForm onChangeFilter={setFilter}/>
            </div>

            <UpdateDocumentDialog
                selectedItem={selectedItem}
                isOpen={isOpenUpdateDialog}
                onOpenChange={setIsOpenUpdateDialog}
            />

            <DeactivateDocumentDialog
                selectedItem={selectedItem}
                isOpen={isOpenDeactivateDialog}
                onOpenChange={setIsOpenDeactivateDialog}
            />

            <DeleteDocumentDialog
                selectedItem={selectedItem}
                isOpen={isOpenDeleteDialog}
                onOpenChange={setIsOpenDeleteDialog}
            />
        </MainLayout>
    );
}

export default Document;
