import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import apiRoutes from "@/routes/api";
import ApiBase from "@/hook/base";

const queryKeyTopic = "topic";

const fetchTopic = async (params) => {
    const response = await new ApiBase().httpGet(apiRoutes.topic.list, params);
    return await response.json();
}

const createTopic = async (params) => {
    const response = await new ApiBase().httpPost(apiRoutes.topic.create, params);
    return await response.json();
};

const updateTopic = async ({id, params}) => {
    const response = await new ApiBase().httpPut(apiRoutes.topic.update.replace(":id", id), params);
    return await response.json();
};

const deletedPermanentlyTopic = async (id) => {
    const response = await new ApiBase().httpDelete(apiRoutes.topic.deletePermanently.replace(":id", id));
    return await response.json();
};

const useCreateTopic = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTopic,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyTopic]);
        },
        onError: (error) => {
        },
    });
};

const useTopic = (params) => {
    return useQuery({
        queryKey: [queryKeyTopic, JSON.stringify(params)],
        queryFn: () => fetchTopic(params),
    })
}

const useUpdateTopic = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTopic,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyTopic]);
        },
        onError: (error) => {
        },
    });
};

const useDeletePermanentlyTopic = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletedPermanentlyTopic,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyTopic]);
        },
        onError: (error) => {
        },
    });
};

export {
    queryKeyTopic,
    useCreateTopic,
    fetchTopic,
    useTopic,
    useUpdateTopic,
    useDeletePermanentlyTopic
}
