"use client";

import MainLayout from "@/components/commons/MainLayout";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import {useDepartments} from "@/hook/useDepartments";
import {CheckCircle2, EllipsisVertical, LockKeyhole, Pencil, Trash2, XCircle} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Typography} from "@/components/ui/typography";
import {omit} from "lodash";
import CreateDepartmentDialog from "@/app/department/CreateDepartmentDialog";
import {Pagination} from "@/components/ui-custom/Pagination";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import UpdateDepartmentDialog from "@/app/department/UpdateDepartmentDialog";
import DepartmentSearchForm from "@/app/department/DepartmentSearchForm";
import DeactivateConfirmDialog from "@/app/department/DeactivateConfirmDialog";
import DeleteDepartmentDialog from "@/app/department/DeleteDepartmentDialog";

const Department = () => {
    const [page, setPage] = useState(1);

    const [filter, setFilter] = useState({});

    const [selectedItem, setSelectedItem] = useState(null);

    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
    const [isOpenDeactivateDialog, setIsOpenDeactivateDialog] = useState(false);
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

    const {data: listDepartmentResp} = useDepartments({
        limit: 20,
        page: page,
        order: JSON.stringify({"t.department_id": "desc"}),
        ...(filter.active === "all" ? omit(filter, "active") : filter)
    });
    const {data: listDepartment, total: totalDepartment} = listDepartmentResp || {};
    const {total, limits, pages} = totalDepartment || {};

    return (
        <MainLayout>
            <div className={cn("flex gap-3 h-full")}>
                <div className="flex-1 py-3 pl-3 flex flex-col h-full">
                    <div className={cn("flex justify-between")}>
                        <Typography variant="h2" className={cn("mb-4")}>Department</Typography>
                        <div className={cn("space-x-3")}>
                            <CreateDepartmentDialog/>
                        </div>
                    </div>
                    <div className={cn("flex-1 overflow-auto")}>
                        <Table>
                            <TableCaption>List of departments in the organization</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={cn("w-20")}>ID</TableHead>
                                    <TableHead className={cn("min-w-[300px]")}>Name</TableHead>
                                    <TableHead className={cn("min-w-[300px]")}>Description</TableHead>
                                    <TableHead className={cn("w-32 text-center")}>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listDepartment?.map((department) => {
                                    const {department_id, department_name, description, active} = department
                                    return (
                                        <TableRow key={department_id}>
                                            <TableCell>{department_id}</TableCell>
                                            <TableCell>{department_name}</TableCell>
                                            <TableCell>{description}</TableCell>
                                            <TableCell>
                                                <div className={cn("flex justify-center")}>
                                                    {active ? (
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
                                                                setSelectedItem(department);
                                                                setIsOpenUpdateDialog(true)
                                                            }}
                                                        >
                                                            <Pencil/> Update
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className={cn("hover:cursor-pointer")}
                                                            onClick={() => {
                                                                setSelectedItem(department);
                                                                setIsOpenDeactivateDialog(true)
                                                            }}
                                                        >
                                                            <LockKeyhole/> {active ? "Deactivate" : "Activate"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className={cn("hover:cursor-pointer")}
                                                            onClick={() => {
                                                                setSelectedItem(department);
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

                <DepartmentSearchForm onChangeFilter={setFilter}/>
            </div>

            <UpdateDepartmentDialog
                departmentItem={selectedItem}
                isOpen={isOpenUpdateDialog}
                onOpenChange={setIsOpenUpdateDialog}
            />

            <DeactivateConfirmDialog
                department={selectedItem}
                isOpen={isOpenDeactivateDialog}
                onOpenChange={setIsOpenDeactivateDialog}
            />

            <DeleteDepartmentDialog
                department={selectedItem}
                isOpen={isOpenDeleteDialog}
                onOpenChange={setIsOpenDeleteDialog}
            />
        </MainLayout>
    )
}

export default Department;