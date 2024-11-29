import {useQuery} from '@tanstack/react-query'
import apiRoutes from "@/routes/api";
import ApiBase from "@/hook/base";

const queryKeyDocument = "role";

const fetchDocument = async (params) => {
    const response = await new ApiBase().httpGet(apiRoutes.document.list, params);
    const data = await response.json();
    return data.data;
}

const useDocument = (params) => {
    return useQuery({
        queryKey: [queryKeyDocument, JSON.stringify(params)],
        queryFn: () => fetchDocument(params),
    })
}

export {queryKeyDocument, fetchDocument, useDocument}
