import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import apiRoutes from "@/routes/api";
import ApiBase from "@/hook/base";

const queryKeyDocument = "document";

const fetchDocument = async (params) => {
    const response = await new ApiBase().httpGet(apiRoutes.document.list, params);
    return await response.json();
}

const createDocument = async (params) => {
    const response = await new ApiBase().httpPost(apiRoutes.document.create, params);
    return await response.json();
};

const updateDocument = async ({id, params}) => {
    const response = await new ApiBase().httpPut(apiRoutes.document.update.replace(":id", id), params);
    return await response.json();
};

const deletedPermanentlyDocument = async (id) => {
    const response = await new ApiBase().httpDelete(apiRoutes.document.deletePermanently.replace(":id", id));
    return await response.json();
};

const useCreateDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDocument,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyDocument]);
        },
        onError: (error) => {
        },
    });
};

const useDocument = (params) => {
    return useQuery({
        queryKey: [queryKeyDocument, JSON.stringify(params)],
        queryFn: () => fetchDocument(params),
    })
}

const useUpdateDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateDocument,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyDocument]);
        },
        onError: (error) => {
        },
    });
};

const useDeletePermanentlyDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletedPermanentlyDocument,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyDocument]);
        },
        onError: (error) => {
        },
    });
};

export {
    queryKeyDocument,
    useCreateDocument,
    fetchDocument,
    useDocument,
    useUpdateDocument,
    useDeletePermanentlyDocument
}
