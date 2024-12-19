"use client";

import MainLayout from "@/components/commons/MainLayout";
import {cn} from "@/lib/utils";
import {Typography} from "@/components/ui/typography";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CheckCircle2, EllipsisVertical, LockKeyhole, Pencil, Plus, Trash2, XCircle} from "lucide-react";
import {useEffect, useState} from "react";
import {omit} from "lodash";
import {Pagination} from "@/components/ui-custom/Pagination";
import {useRole} from "@/hook/useRole";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {useSubject} from "@/hook/useSubject";
import SubjectSearchForm from "@/app/subject/SubjectSearchForm";
import DeactivateSubjectDialog from "@/app/subject/DeactivateSubjectDialog";
import {Badge} from "@/components/ui/badge";
import UpdateSubjectDialog from "@/app/subject/UpdateSubjectDialog";
import DeleteSubjectDialog from "@/app/subject/DeleteSubjectDialog";
import clientRoutes from "@/routes/client";
import Link from "next/link";

const ListUser = () => {
    const [page, setPage] = useState(1);

    const [filter, setFilter] = useState({});

    const [selectedItem, setSelectedItem] = useState(null);

    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
    const [isOpenDeactivateDialog, setIsOpenDeactivateDialog] = useState(false);
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

    const {data: listDataResp} = useSubject({
        limit: 20,
        page: page,
        order: JSON.stringify({"t.subject_id": "desc"}),
        ...(filter.active === "all" ? omit(filter, "active") : filter)
    });
    const {data: listData, total: totalData} = listDataResp || {};
    const {total, limits, pages} = totalData || {};

    const {data: listRole} = useRole();

    useEffect(() => {
        if (!isOpenUpdateDialog && !isOpenDeactivateDialog && !isOpenDeleteDialog) {
            setSelectedItem(null);
        }
    }, [isOpenUpdateDialog, isOpenDeactivateDialog, isOpenDeleteDialog]);

    return (
        <MainLayout>
            <div className={cn("flex gap-3 h-full")}>
                <div className="flex-1 py-3 pl-3 flex flex-col h-full overflow-auto">
                    <div className={cn("flex justify-between items-center mb-4")}>
                        <Typography variant="h2" className={cn("pb-0")}>Subject</Typography>
                        <div className={cn("space-x-3")}>
                            <Button asChild>
                                <Link href={clientRoutes.subject.create.path}>
                                    <Plus/> Create
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className={cn("flex-1 overflow-auto")}>
                        <Table>
                            <TableCaption>List of subject in the organization</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={cn("w-20")}>STT</TableHead>
                                    <TableHead className={cn("min-w-[300px]")}>Subject</TableHead>
                                    <TableHead className={cn("min-w-[300px]")}>Description</TableHead>
                                    <TableHead className={cn("max-w-[200px]")}>Department</TableHead>
                                    <TableHead className={cn("w-32 text-center")}>Status</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listData?.map((item, index) => {
                                    const {
                                        subject_id,
                                        subject_name,
                                        department,
                                        description,
                                        subject_active: active
                                    } = item;
                                    return (
                                        <TableRow key={subject_id}>
                                            <TableCell>{(page - 1) * limits + index + 1}</TableCell>
                                            <TableCell>{subject_name}</TableCell>
                                            <TableCell>{description}</TableCell>
                                            <TableCell>
                                                <div
                                                    className={cn("flex gap-1.5 p-1 flex-wrap")}
                                                >
                                                    {department.map(({department_id, department_name}, i) => i < 2 && (
                                                        <Badge
                                                            key={department_id}
                                                        >
                                                            <span
                                                                className={cn("truncate max-w-[200px]")}>{department_name}</span>
                                                        </Badge>
                                                    ))}

                                                    {department.length - 2 > 0 && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost"
                                                                        className="p-3 border border-[#ccc] rounded bg-[#f0f0f0f] h-0 w-0">
                                                                    <span>+{department.length - 2}</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {department.map((item, i) => {
                                                                    const {department_id, department_name} = item;

                                                                    return i >= 2 && (
                                                                        <DropdownMenuItem key={department_id}>
                                                                            {department_name}
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
                                                                href={clientRoutes.subject.update.path.replace(":id", subject_id)}>
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

                <SubjectSearchForm onChangeFilter={setFilter}/>
            </div>

            <UpdateSubjectDialog
                selectedItem={selectedItem}
                isOpen={isOpenUpdateDialog}
                onOpenChange={setIsOpenUpdateDialog}
            />

            <DeactivateSubjectDialog
                selectedItem={selectedItem}
                isOpen={isOpenDeactivateDialog}
                onOpenChange={setIsOpenDeactivateDialog}
            />

            <DeleteSubjectDialog
                selectedItem={selectedItem}
                isOpen={isOpenDeleteDialog}
                onOpenChange={setIsOpenDeleteDialog}
            />
        </MainLayout>
    );
}

export default ListUser;
