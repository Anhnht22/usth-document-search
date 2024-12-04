"use client";

import MainLayout from "@/components/commons/MainLayout";
import {cn} from "@/lib/utils";
import {Typography} from "@/components/ui/typography";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CheckCircle2, EllipsisVertical, LockKeyhole, Pencil, Trash2, XCircle} from "lucide-react";
import {useEffect, useState} from "react";
import {omit} from "lodash";
import {useUser} from "@/hook/useUsers";
import {Pagination} from "@/components/ui-custom/Pagination";
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

    const maxRows = 2; // Số dòng tối đa hiển thị
    const itemMinWidth = 60; // Độ rộng tối thiểu của mỗi phần tử
    const itemHeight = 32; // Kích thước chiều cao của mỗi phần tử (ước tính)
    const itemPadding = 6; // Padding cho mỗi phần tử
    const containerWidth = 100; // Chiều rộng của vùng chứa

    // Hàm xử lý tính toán số lượng phần tử hiển thị trong mỗi dòng
    const calculateVisibleItems = (departments, maxRows, itemHeight, itemPadding, containerWidth, itemMinWidth) => {
        // Số phần tử mỗi dòng có thể chứa dựa trên chiều rộng của vùng chứa
        const maxItemsPerRow = Math.floor(containerWidth / itemMinWidth);

        // Tổng số phần tử có thể hiển thị trong maxRows dòng
        const maxItemsInVisibleRows = maxRows * maxItemsPerRow;

        // Lấy các phần tử có thể hiển thị
        const visibleItems = departments.slice(0, maxItemsInVisibleRows);
        // Các phần tử bị ẩn (vượt quá giới hạn hiển thị)
        const hiddenItems = departments.slice(maxItemsInVisibleRows);
        const remainingItems = departments.length - visibleItems.length;

        return {visibleItems, hiddenItems, remainingItems, maxItemsPerRow};
    };

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
                                    <TableHead>Department</TableHead>
                                    <TableHead className={cn("w-32 text-center")}>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listData?.map((item) => {
                                    const {user_id, username, email, role_id, active, department} = item;
                                    const {
                                        visibleItems,
                                        hiddenItems,
                                        remainingItems
                                    } = calculateVisibleItems(department, maxRows, itemHeight, itemPadding, containerWidth, itemMinWidth);
                                    return (
                                        <TableRow key={user_id}>
                                            <TableCell>{user_id}</TableCell>
                                            <TableCell>{username}</TableCell>
                                            <TableCell>{email}</TableCell>
                                            <TableCell>{listRole?.data?.find(({role_id: roleId}) => roleId === role_id)?.role_name}</TableCell>
                                            <TableCell>
                                                <div style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '6px',
                                                    maxHeight: `${(maxRows * itemHeight) + ((maxRows - 1) * 6)}px`,
                                                    padding: '3px',
                                                    overflow: 'hidden',
                                                }}>
                                                    {visibleItems.map(({department_id, department_name}) => (
                                                        <p
                                                            key={department_id}
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                                textOverflow: 'ellipsis',
                                                                padding: '3px',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '4px',
                                                                overflow: 'hidden',
                                                                minWidth: `${itemMinWidth}px`,
                                                            }}
                                                        >
                                                            {department_name}
                                                        </p>
                                                    ))}

                                                    {remainingItems > 0 && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost"
                                                                        className="p-3 border border-[#ccc] rounded bg-[#f0f0f0f] h-0 w-0">
                                                                    <span>+{remainingItems}</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {hiddenItems.map(({department_id, department_name}) => (
                                                                    <DropdownMenuItem key={department_id}>
                                                                        {department_name}
                                                                    </DropdownMenuItem>
                                                                ))}
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
