import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import apiRoutes from "@/routes/api";
import ApiBase from "@/hook/base";

const queryKeyKeyword = "keyword";

const fetchKeyword = async (params) => {
    const response = await new ApiBase().httpGet(apiRoutes.keyword.list, params);
    return await response.json();
}

const createKeyword = async (params) => {
    const response = await new ApiBase().httpPost(apiRoutes.keyword.create, params);
    return await response.json();
};

const updateKeyword = async ({id, params}) => {
    const response = await new ApiBase().httpPut(apiRoutes.keyword.update.replace(":id", id), params);
    return await response.json();
};

const deletedPermanentlyKeyword = async (id) => {
    const response = await new ApiBase().httpDelete(apiRoutes.keyword.deletePermanently.replace(":id", id));
    return await response.json();
};

const useCreateKeyword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createKeyword,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyKeyword]);
        },
        onError: (error) => {
        },
    });
};

const useKeyword = (params) => {
    return useQuery({
        queryKey: [queryKeyKeyword, JSON.stringify(params)],
        queryFn: () => fetchKeyword(params),
    })
}

const useUpdateKeyword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateKeyword,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyKeyword]);
        },
        onError: (error) => {
        },
    });
};

const useDeletePermanentlyKeyword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletedPermanentlyKeyword,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyKeyword]);
        },
        onError: (error) => {
        },
    });
};

export {
    queryKeyKeyword,
    useCreateKeyword,
    fetchKeyword,
    useKeyword,
    useUpdateKeyword,
    useDeletePermanentlyKeyword
}
