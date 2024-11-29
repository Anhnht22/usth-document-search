import {useQuery} from '@tanstack/react-query'
import apiRoutes from "@/routes/api";
import ApiBase from "@/hook/base";

const queryKeyRole = "role";

const fetchRole = async (params) => {
    const response = await new ApiBase().httpGet(apiRoutes.role.list, params);
    const data = await response.json();
    return data.data;
}

const useRole = (params) => {
    return useQuery({
        queryKey: [queryKeyRole, JSON.stringify(params)],
        queryFn: () => fetchRole(params),
    })
}

export {queryKeyRole, fetchRole, useRole}
