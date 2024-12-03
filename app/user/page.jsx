"use client";

import MainLayout from "@/components/commons/MainLayout";
import {cn} from "@/lib/utils";
import {Typography} from "@/components/ui/typography";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CheckCircle2, EllipsisVertical, LockKeyhole, Pencil, Trash2, XCircle} from "lucide-react";
import {useEffect, useState} from "react";
import {omit} from "lodash";
import {useUser} from "@/hook/useUsers";
import {CustomPagination} from "@/components/commons/CustomPagination";
import UserSearchForm from "@/app/user/UserSearchForm";
import {useRole} from "@/hook/useRole";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import CreateUserDialog from "@/app/user/CreateUserDialog";
import DeactivateUserDialog from "@/app/user/DeactivateUserDialog";
import DeleteUserDialog from "@/app/user/DeleteUserDialog";
import UpdateUserDialog from "@/app/user/UpdateUserDialog";

const ListUser = () => {
    const [page, setPage] = useState(1);

    const [filter, setFilter] = useState({});

    const [selectedItem, setSelectedItem] = useState(null);

    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false);
    const [isOpenDeactivateDialog, setIsOpenDeactivateDialog] = useState(false);
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

    const {data: listDataResp} = useUser({
        limit: 20,
        page: page,
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
                <div className="flex-1 py-3 pl-3 flex flex-col h-full">
                    <div className={cn("flex justify-between")}>
                        <Typography variant="h2" className={cn("mb-4")}>User</Typography>
                        <div className={cn("space-x-3")}>
                            <CreateUserDialog/>
                        </div>
                    </div>
                    <div className={cn("flex-1 overflow-auto")}>
                        <Table>
                            <TableCaption>List of departments in the organization</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={cn("w-20")}>ID</TableHead>
                                    <TableHead className={cn("min-w-[300px]")}>Username</TableHead>
                                    <TableHead className={cn("min-w-[300px]")}>Email</TableHead>
                                    <TableHead className={cn("w-32")}>Role</TableHead>
                                    <TableHead className={cn("w-32 text-center")}>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listData?.map((item) => {
                                    const {user_id, username, email, role_id, active} = item;
                                    return (
                                        <TableRow key={user_id}>
                                            <TableCell>{user_id}</TableCell>
                                            <TableCell>{username}</TableCell>
                                            <TableCell>{email}</TableCell>
                                            <TableCell>{listRole?.find(({role_id: roleId}) => roleId === role_id)?.role_name}</TableCell>
                                            <TableCell>
                                                <div className={cn("flex justify-center")}>
                                                    {active
                                                        ? <CheckCircle2 className="text-green-500"/>
                                                        : <XCircle className="text-red-500"/>
                                                    }
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
                        {total ? <CustomPagination
                            totalRecord={total}
                            perPage={limits}
                            page={pages}
                            onPageChange={setPage}
                        /> : null}
                    </div>
                </div>

                <UserSearchForm onChangeFilter={setFilter}/>
            </div>

            <UpdateUserDialog
                selectedItem={selectedItem}
                isOpen={isOpenUpdateDialog}
                onOpenChange={setIsOpenUpdateDialog}
            />

            <DeactivateUserDialog
                selectedItem={selectedItem}
                isOpen={isOpenDeactivateDialog}
                onOpenChange={setIsOpenDeactivateDialog}
            />

            <DeleteUserDialog
                selectedItem={selectedItem}
                isOpen={isOpenDeleteDialog}
                onOpenChange={setIsOpenDeleteDialog}
            />
        </MainLayout>
    );
}

export default ListUser;
