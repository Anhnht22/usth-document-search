"use client";

import MainLayout from "@/components/commons/MainLayout";
import {cn} from "@/lib/utils";
import {Typography} from "@/components/ui/typography";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CheckCircle2, EllipsisVertical, KeyRound, LockKeyhole, Pencil, Plus, Trash2, XCircle} from "lucide-react";
import {useEffect, useState} from "react";
import {omit} from "lodash";
import {useUser} from "@/hook/useUsers";
import {Pagination} from "@/components/ui-custom/Pagination";
import UserSearchForm from "@/app/user/UserSearchForm";
import {useRole} from "@/hook/useRole";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import DeactivateUserDialog from "@/app/user/DeactivateUserDialog";
import DeleteUserDialog from "@/app/user/DeleteUserDialog";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import clientRoutes from "@/routes/client";
import UpdatePasswordUserDialog from "@/app/user/ResetPasswordUserDialog";

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
        order: JSON.stringify({"t.user_id": "desc"}),
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
                    <div className={cn("flex justify-between")}>
                        <Typography variant="h2" className={cn("mb-4")}>User</Typography>
                        <div className={cn("space-x-3")}>
                            <Button asChild>
                                <Link href={clientRoutes.user.create.path}>
                                    <Plus/> Create
                                </Link>
                            </Button>
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
                                    <TableHead className={cn("max-w-[200px]")}>Department</TableHead>
                                    <TableHead className={cn("w-32 text-center")}>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listData?.map((item, index) => {
                                    const {user_id, username, email, role_id, active, department} = item;
                                    return (
                                        <TableRow key={user_id}>
                                            <TableCell>{(page - 1) * limits + index + 1}</TableCell>
                                            <TableCell>{username}</TableCell>
                                            <TableCell>{email}</TableCell>
                                            <TableCell>{listRole?.data?.find(({role_id: roleId}) => roleId === role_id)?.role_name}</TableCell>
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
                                                                href={clientRoutes.user.update.path.replace(":id", user_id)}>
                                                                <Pencil/> Update
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className={cn("hover:cursor-pointer")}
                                                            onClick={() => {
                                                                setSelectedItem(item);
                                                                setIsOpenUpdateDialog(true)
                                                            }}
                                                        >
                                                            <KeyRound/> Change password
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

                <UserSearchForm onChangeFilter={setFilter}/>
            </div>

            <UpdatePasswordUserDialog
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
