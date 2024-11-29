"use client";

import MainLayout from "@/components/commons/MainLayout";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import {useDeletePermanentlyDepartment, useDepartments} from "@/hook/useDepartments";
import {CheckCircle2, EllipsisVertical, XCircle} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {Button} from "@/components/ui/button";
import {Typography} from "@/components/ui/typography";
import {omit} from "lodash";
import CreateDepartmentDialog from "@/app/department/CreateDepartmentDialog";
import {v4} from "uuid";
import {CustomPagination} from "@/components/commons/CustomPagination";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {toast} from "react-toastify";
import UpdateDepartmentDialog from "@/app/department/UpdateDepartmentDialog";
import SearchForm from "@/app/department/SearchForm";
import DeactivateConfirmDialog from "@/app/department/DeactivateConfirmDialog";

const Department = () => {
    const [page, setPage] = useState(1);

    const [filter, setFilter] = useState({});

    const [selectedItem, setSelectedItem] = useState(null);
    const [isOpenDeletePermanentlyDialog, setIsOpenDeletePermanentlyDialog] = useState(false);
    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);

    const [isOpenDeactivateDialog, setIsOpenDeactivateDialog] = useState(false);

    const {data: listDepartmentResp, isLoading, isFetching} = useDepartments({
        limit: 20,
        page: page,
        order: JSON.stringify({"t.department_id": "desc"}),
        ...(filter.active === "all" ? omit(filter, "active") : filter)
    });
    const {data: listDepartment, total: totalDepartment} = listDepartmentResp || {};

    const deletePermanentlyDepartmentMutation = useDeletePermanentlyDepartment();

    const deletePermanentlyDepartment = (id) => {
        deletePermanentlyDepartmentMutation.mutate(id);
    }

    useEffect(() => {
        if (deletePermanentlyDepartmentMutation.data) {
            const {returnCode} = deletePermanentlyDepartmentMutation.data
            if (returnCode === 200) {
                setIsOpenDeletePermanentlyDialog(false);
                toast.success(
                    <div key={v4()}>
                        Delete permanently department <b>{selectedItem?.department_name}</b> successfully
                    </div>
                );
                deletePermanentlyDepartmentMutation.reset();
            }
        }
    }, [deletePermanentlyDepartmentMutation.data, selectedItem]);

    const deleteDepartmentPermanentlyConfirm = useMemo(() => {
        if (selectedItem) {
            const {department_id, department_name} = selectedItem;

            return isOpenDeletePermanentlyDialog && (
                <Dialog open={isOpenDeletePermanentlyDialog} onOpenChange={setIsOpenDeletePermanentlyDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Delete Permanently
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete permanently {department_name}?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsOpenDeletePermanentlyDialog(false)}>
                                Hủy
                            </Button>
                            <Button
                                disabled={deletePermanentlyDepartmentMutation.isPending}
                                onClick={() => deletePermanentlyDepartment(department_id)}
                            >
                                Xác nhận
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )
        }

        return <></>
    }, [isOpenDeletePermanentlyDialog, selectedItem, deletePermanentlyDepartmentMutation.isPending]);

    const pagination = useMemo(() => {
        if (!totalDepartment) return <></>;

        const {total, limits, pages} = totalDepartment;
        return <CustomPagination
            key={v4()}
            totalRecord={total}
            perPage={limits}
            page={pages}
            onPageChange={setPage}
        />
    })

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
                                                                setIsOpenDeactivateDialog(true)
                                                            }}
                                                        >
                                                            {active ? "Deactivate" : "Activate"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className={cn("hover:cursor-pointer")}
                                                            onClick={() => {
                                                                setSelectedItem(department);
                                                                setIsOpenDeletePermanentlyDialog(true)
                                                            }}
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className={cn("hover:cursor-pointer")}
                                                            onClick={() => {
                                                                setSelectedItem(department);
                                                                setIsOpenUpdateDialog(true)
                                                            }}
                                                        >
                                                            Update
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
                        {pagination}
                    </div>
                </div>

                <SearchForm onChangeFilter={setFilter}/>
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

            {
                deleteDepartmentPermanentlyConfirm
            }
        </MainLayout>
    )
}

export default Department;