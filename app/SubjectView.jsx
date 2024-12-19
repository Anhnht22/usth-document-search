import {useEffect, useState} from "react";
import {useAuth} from "@/provider/AuthProvider";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import {Pagination} from "@/components/ui-custom/Pagination";
import {useSubjectByUser} from "@/hook/useSubject";
import {Badge} from "@/components/ui/badge";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";

const SubjectView = () => {
    const {userData} = useAuth();

    const [params, setParams] = useState(null);
    const [page, setPage] = useState(1);

    const {data: listDataResp} = useSubjectByUser(params)
    const {data: listData, total: totalData} = listDataResp || {};
    const {total, limits, pages} = totalData || {};

    useEffect(() => {
        if (userData?.user_id) {
            setParams({
                limit: 5,
                page: page,
                order: JSON.stringify({"t.subject_id": "desc"}),
                user_id: userData.user_id,
                active: 1,
            });
        }
    }, [userData?.user_id, page]);

    return (
        <div className={cn("h-full flex flex-col p-2")}>
            <div className={cn("overflow-auto flex-grow")}>
                <Table>
                    <TableCaption>List of subject in the organization</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={cn("w-6")}>STT</TableHead>
                            <TableHead className={cn("w-32")}>Subject</TableHead>
                            <TableHead className={cn("w-36")}>Description</TableHead>
                            <TableHead>Department</TableHead>
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

export default SubjectView;