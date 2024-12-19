import {useDepartmentsByUser} from "@/hook/useDepartments";
import {useEffect, useState} from "react";
import {useAuth} from "@/provider/AuthProvider";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import {Pagination} from "@/components/ui-custom/Pagination";

const DepartmentView = () => {
    const {userData} = useAuth();

    const [params, setParams] = useState(null);
    const [page, setPage] = useState(1);

    const {data: listDepartmentResp} = useDepartmentsByUser(params)
    const {data: listDepartment, total: totalDepartment} = listDepartmentResp || {};
    const {total, limits, pages} = totalDepartment || {};

    useEffect(() => {
        if (userData?.user_id) {
            setParams({
                limit: 5,
                page: page,
                order: JSON.stringify({"t.department_id": "desc"}),
                user_id: userData.user_id,
                active: 1,
            });
        }
    }, [userData?.user_id, page]);

    return (
        <div className={cn("h-full flex flex-col p-2")}>
            <div className={cn("overflow-auto flex-grow")}>
                <Table>
                    <TableCaption>List of departments in the organization</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={cn("w-20")}>ID</TableHead>
                            <TableHead className={cn("min-w-[300px]")}>Name</TableHead>
                            <TableHead className={cn("min-w-[300px]")}>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listDepartment?.map((department, index) => {
                            const {department_id, department_name, description, active} = department
                            return (
                                <TableRow key={department_id}>
                                    <TableCell>{(page - 1) * limits + index + 1}</TableCell>
                                    <TableCell>{department_name}</TableCell>
                                    <TableCell>{description}</TableCell>
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
    )
}

export default DepartmentView;