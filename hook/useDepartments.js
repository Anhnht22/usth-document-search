import {useQuery} from '@tanstack/react-query'
import apiRoutes from "@/routes/api";
import ApiBase from "@/hook/base";

const queryKeyDepartments = "departments";

const fetchDepartments = async (params) => {
    const response = await new ApiBase().httpGet(apiRoutes.department.list, params);
    const data = await response.json();
    return data.data;
}

const useDepartments = (params) => {
    return useQuery({
        queryKey: [queryKeyDepartments, JSON.stringify(params)],
        queryFn: () => fetchDepartments(params),
    })
}

export {queryKeyDepartments, useDepartments, fetchDepartments}
