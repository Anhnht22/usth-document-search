"use client";

import MainLayout from "@/components/commons/MainLayout";
import {cn} from "@/lib/utils";
import {Typography} from "@/components/ui/typography";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CheckCircle2, EllipsisVertical, LockKeyhole, Pencil, Plus, Trash2, XCircle} from "lucide-react";
import {Pagination} from "@/components/ui-custom/Pagination";
import {useCallback, useEffect, useState} from "react";
import {useDocument, useDownloadDocument} from "@/hook/useDocument";
import {convertFileName, convertUnixDate, ddMMyyyy} from "@/utils/common";
import DocumentSearchForm from "@/app/document/DocumentSearchForm";
import DeactivateDocumentDialog from "@/app/document/DeactivateDocumentDialog";
import DeleteDocumentDialog from "@/app/document/DeleteDocumentDialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/provider/AuthProvider";
import {omit} from "lodash";
import {actions, rolesGroup} from "@/roles/constants";
import roles from "@/roles";
import StatusDocumentUpdate from "@/app/document/StatusDocumentUpdate";
import PreviewFile from "@/components/commons/PreviewFile";
import envConfig from "@/utils/envConfig";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import Link from "next/link";
import clientRoutes from "@/routes/client";
import ThumbDoc from "@/components/commons/ThumbDoc";
import {Badge} from "@/components/ui/badge";

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

    const downloadDocumentMutation = useDownloadDocument()
    const onDownload = useCallback((selectedItem) => {
        downloadDocumentMutation.mutate({
            name: convertFileName(selectedItem.title),
            file: selectedItem.file_path
        });
    }, []);

    return role && (
        <MainLayout>
            <div className={cn("flex gap-3 h-full")}>
                <div className="flex-1 py-3 pl-3 flex flex-col h-full overflow-auto">
                    <div className={cn("flex justify-between")}>
                        <Typography variant="h2" className={cn("mb-4")}>Document</Typography>
                        <div className={cn("space-x-3")}>
                            {/*Kiểm tra xem role có được thực hiện action nào không*/}
                            {roles[rolesFunction][role].includes(actions.create) && (
                                <Button asChild>
                                    <Link href={clientRoutes.document.create.path}>
                                        <Plus/> Create
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className={cn("flex-1")}>
                        <Table>
                            <TableCaption>List of document in the organization</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={cn("w-20")}>STT</TableHead>
                                    <TableHead className={cn("w-[250px]")}>Title</TableHead>
                                    <TableHead className={cn("w-[300px]")}>Description</TableHead>
                                    <TableHead className={cn("min-w-[200px]")}>Topic</TableHead>
                                    <TableHead className={cn("min-w-[200px]")}>Keyword</TableHead>
                                    <TableHead className={cn("min-w-[300px]")}>File path</TableHead>
                                    <TableHead className={cn("min-w-36")}>Created by</TableHead>
                                    <TableHead className={cn("min-w-[100px] text-center")}>Created date</TableHead>
                                    <TableHead className={cn("min-w-[150px] text-center")}>Document status</TableHead>
                                    <TableHead className={cn("w-32 text-center")}>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listData?.map((item, index) => {
                                    const {
                                        document_id, file_path, title, description, upload_date,
                                        document_active, username, topic, status, keyword
                                    } = item;
                                    const uploadString = convertUnixDate(upload_date / 1000, ddMMyyyy);

                                    return (
                                        <TableRow key={document_id}>
                                            <TableCell>{(page - 1) * limits + index + 1}</TableCell>
                                            <TableCell>{title}</TableCell>
                                            <TableCell>{description}</TableCell>
                                            <TableCell>
                                                <div
                                                    className={cn("flex gap-1.5 p-1 flex-wrap")}
                                                >
                                                    {topic.map(({topic_id, topic_name}, i) => i < 2 && (
                                                        <Badge
                                                            key={topic_id}
                                                        >
                                                            <span
                                                                className={cn("truncate max-w-[200px]")}>{topic_name}</span>
                                                        </Badge>
                                                    ))}

                                                    {topic.length - 2 > 0 && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost"
                                                                        className="p-3 border border-[#ccc] rounded bg-[#f0f0f0f] h-0 w-0">
                                                                    <span>+{topic.length - 2}</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {topic.map((item, i) => {
                                                                    const {topic_id, topic_name} = item;

                                                                    return i >= 2 && (
                                                                        <DropdownMenuItem key={topic_id}>
                                                                            {topic_name}
                                                                        </DropdownMenuItem>
                                                                    )
                                                                })}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div
                                                    className={cn("flex gap-1.5 p-1 flex-wrap")}
                                                >
                                                    {keyword.map(({keyword_id, keyword}, i) => i < 2 && (
                                                        <Badge
                                                            key={keyword_id}
                                                        >
                                                            <span
                                                                className={cn("truncate max-w-[200px]")}>{keyword}</span>
                                                        </Badge>
                                                    ))}

                                                    {keyword.length - 2 > 0 && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost"
                                                                        className="p-3 border border-[#ccc] rounded bg-[#f0f0f0f] h-0 w-0">
                                                                    <span>+{keyword.length - 2}</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {keyword.map((item, i) => {
                                                                    const {keyword_id, keyword} = item;

                                                                    return i >= 2 && (
                                                                        <DropdownMenuItem key={keyword_id}>
                                                                            {keyword}
                                                                        </DropdownMenuItem>
                                                                    )
                                                                })}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className={cn(
                                                    "hover:underline hover:cursor-pointer",
                                                    "flex items-center gap-2"
                                                )}
                                                     onClick={() => {
                                                         setSelectedItem(item)
                                                         setIsOpenPreviewDialog(true)
                                                     }}
                                                >
                                                    <div className={cn('w-[35px]')}>
                                                        <ThumbDoc file_path={file_path}/>
                                                    </div>
                                                    {file_path.split('/').pop()}
                                                </div>
                                            </TableCell>
                                            <TableCell>{username}</TableCell>
                                            <TableCell className={cn("text-center")}>{uploadString}</TableCell>
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
                                                                    href={clientRoutes.document.update.path.replace(":id", document_id)}>
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
                            className={cn("relative flex flex-col")}
                            style={{maxHeight: "calc(100dvh - 150px)"}}
                        >
                            <div className={cn("flex-grow overflow-y-auto")}>
                                <PreviewFile fileUrl={envConfig.endPointStatic + "/" + selectedItem.file_path}/>
                            </div>

                            <div
                                className={cn(
                                    "h-[50px] bg-white",
                                    "flex justify-end items-center gap-3 p-3"
                                )}
                            >
                                <Button onClick={() => onDownload(selectedItem)}>
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
