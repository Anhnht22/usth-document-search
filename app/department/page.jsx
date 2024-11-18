"use client";

import MainLayout from "@/components/commons/MainLayout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import {useDepartments} from "@/hook/useDepartments";

const Department = () => {
    const {data: listDepartment, isPending, isFetching} = useDepartments({limit: 20});

    return (
        <MainLayout>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Danh sách phòng ban</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>Danh sách các phòng ban trong tổ chức</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className={cn("w-20")}>ID</TableHead>
                                <TableHead className={cn("min-w-[300px]")}>Tên phòng ban</TableHead>
                                <TableHead className={cn("min-w-[300px]")}>Mô tả</TableHead>
                                {/*<TableHead className={cn("w-32 text-center")}>Trạng thái</TableHead>*/}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listDepartment?.map((department) => (
                                <TableRow key={department.department_id}>
                                    <TableCell>{department.department_id}</TableCell>
                                    <TableCell>{department.department_name}</TableCell>
                                    <TableCell>{department.description}</TableCell>
                                    {/*<TableCell className={cn("flex justify-center")}>*/}
                                    {/*    {department.active ? (*/}
                                    {/*        <CheckCircle2 className="text-green-500"/>*/}
                                    {/*    ) : (*/}
                                    {/*        <XCircle className="text-red-500"/>*/}
                                    {/*    )}*/}
                                    {/*</TableCell>*/}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </MainLayout>
    )
}

export default Department;