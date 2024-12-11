"use client";

import MainLayout from "@/components/commons/MainLayout";
import {cn} from "@/lib/utils";
import {Typography} from "@/components/ui/typography";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CheckCircle2, EllipsisVertical, LockKeyhole, Pencil, Trash2, XCircle} from "lucide-react";
import {Pagination} from "@/components/ui-custom/Pagination";
import {useEffect, useState} from "react";
import {useDocument} from "@/hook/useDocument";
import {convertUnixDate, ddMMyyyy} from "@/utils/common";
import DocumentSearchForm from "@/app/document/DocumentSearchForm";
import UpdateDocumentDialog from "@/app/document/UpdateDocumentDialog";
import DeactivateDocumentDialog from "@/app/document/DeactivateDocumentDialog";
import DeleteDocumentDialog from "@/app/document/DeleteDocumentDialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/provider/AuthProvider";
import {omit} from "lodash";
import {actions, rolesGroup} from "@/roles/constants";
import CreateDocumentDialog from "@/app/document/CreateDocumentDialog";
import roles from "@/roles";
import StatusDocumentUpdate from "@/app/document/StatusDocumentUpdate";
import PreviewFile from "@/components/commons/PreviewFile";
import envConfig from "@/utils/envConfig";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";

const rolesFunction = rolesGroup.document;

const Document = () => {
    const {role} = useAuth();

    const [page, setPage] = useState(1);

    const [filter, setFilter] = useState({});

    const [selectedItem, setSelectedItem] = useState(null);

    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
    const [isOpenDeactivateDialog, setIsOpenDeactivateDialog] = useState(false);
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
    const [isOpenPreviewDialog, setIsOpenPreviewDialog] = useState(false);

    const {data: listDataResp} = useDocument({
        limit: 20,
        page: page,
        order: JSON.stringify({"t.document_id": "desc"}),
        ...(filter.active === "all" ? omit(filter, "active") : filter)
    });
    const {data: listData, total: totalData} = listDataResp || {};
    const {total, limits, pages} = totalData || {};

    useEffect(() => {
        if (!isOpenUpdateDialog && !isOpenDeactivateDialog && !isOpenDeleteDialog) {
            setSelectedItem(null);
        }
    }, [isOpenUpdateDialog, isOpenDeactivateDialog, isOpenDeleteDialog]);

    return role && (
        <MainLayout>
            <div className={cn("flex gap-3 h-full")}>
                <div className="flex-1 py-3 pl-3 flex flex-col h-full">
                    <div className={cn("flex justify-between")}>
                        <Typography variant="h2" className={cn("mb-4")}>Document</Typography>
                        <div className={cn("space-x-3")}>
                            {/*Kiểm tra xem role có được thực hiện action nào không*/}
                            {roles[rolesFunction][role].includes(actions.create) && <CreateDocumentDialog/>}
                        </div>
                    </div>
                    <div className={cn("flex-1 overflow-auto")}>
                        <Table>
                            <TableCaption>List of document in the organization</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={cn("w-20")}>STT</TableHead>
                                    <TableHead className={cn("min-w-[150px]")}>Topic</TableHead>
                                    <TableHead className={cn("w-[250px]")}>Title</TableHead>
                                    <TableHead className={cn("w-[300px]")}>Description</TableHead>
                                    <TableHead className={cn("min-w-[300px]")}>File path</TableHead>
                                    <TableHead className={cn("min-w-36")}>Created by</TableHead>
                                    <TableHead className={cn("w-60")}>Created date</TableHead>
                                    <TableHead className={cn("w-60 text-center")}>Document status</TableHead>
                                    <TableHead className={cn("w-32 text-center")}>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listData?.map((item, index) => {
                                    const {
                                        document_id, file_path, title, description, upload_date,
                                        document_active, username, topic_name, status
                                    } = item;
                                    const uploadString = convertUnixDate(upload_date / 1000, ddMMyyyy);

                                    return (
                                        <TableRow key={document_id}>
                                            <TableCell>{index * page + 1}</TableCell>
                                            <TableCell>{topic_name}</TableCell>
                                            <TableCell>{title}</TableCell>
                                            <TableCell>{description}</TableCell>
                                            <TableCell>
                                                <div className={cn("hover:underline hover:cursor-pointer")}
                                                     onClick={() => {
                                                         setSelectedItem(item)
                                                         setIsOpenPreviewDialog(true)
                                                     }}
                                                >
                                                    {file_path.split('/').pop()}
                                                </div>
                                            </TableCell>
                                            <TableCell>{username}</TableCell>
                                            <TableCell>{uploadString}</TableCell>
                                            <TableCell className={cn("w-64 text-center")}>
                                                <StatusDocumentUpdate selectedItem={item}/>
                                            </TableCell>
                                            <TableCell>
                                                <div className={cn("flex justify-center")}>
                                                    {document_active ? (
                                                        <CheckCircle2 className="text-green-500"/>
                                                    ) : (
                                                        <XCircle className="text-red-500"/>
                                                    )}
                                                </div>
                                            </TableCell>
                                            {roles[rolesFunction][role].includes(actions.update) && (
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
                                            )}
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

            {selectedItem && (
                <Dialog open={isOpenPreviewDialog} onOpenChange={setIsOpenPreviewDialog}>
                    <DialogContent className={cn("lg:max-w-screen-lg")}>
                        <DialogHeader>
                            <DialogTitle>Document Preview</DialogTitle>
                            <DialogDescription>
                                Preview Document
                            </DialogDescription>
                        </DialogHeader>

                        <div
                            className={cn("overflow-y-auto relative")}
                            style={{maxHeight: "calc(100dvh - 150px - 50px)"}}
                        >
                            <PreviewFile fileUrl={envConfig.endPointStatic + "/" + selectedItem.file_path}/>

                            <div
                                className={cn(
                                    "h-[50px] sticky -bottom-[1px] bg-white",
                                    "flex justify-end items-center gap-3 p-3"
                                )}
                            >
                                <Button
                                    onClick={() => {
                                        if (selectedItem && selectedItem.file_path) {
                                            const fileUrl = envConfig.endPointStatic + "/" + selectedItem.file_path;
                                            const link = document.createElement('a');
                                            link.href = fileUrl;
                                            link.download = selectedItem.file_path.split('/').pop(); // Tên file
                                            link.click();
                                        }
                                    }}
                                >
                                    Download
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </MainLayout>
    );
}

export default Document;
