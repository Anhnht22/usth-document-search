import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import apiRoutes from "@/routes/api";
import ApiBase from "@/hook/base";

const queryKeySubject = "subject";

const fetchSubject = async (params) => {
    const response = await new ApiBase().httpGet(apiRoutes.subject.list, params);
    return await response.json();
}

const createSubject = async (params) => {
    const response = await new ApiBase().httpPost(apiRoutes.subject.create, params);
    return await response.json();
};

const updateSubject = async ({id, params}) => {
    const response = await new ApiBase().httpPut(apiRoutes.subject.update.replace(":id", id), params);
    return await response.json();
};

const deletedSubject = async (id) => {
    const response = await new ApiBase().httpDelete(apiRoutes.subject.delete.replace(":id", id));
    return await response.json();
};

const deletedPermanentlySubject = async (id) => {
    const response = await new ApiBase().httpDelete(apiRoutes.subject.deletePermanently.replace(":id", id));
    return await response.json();
};

const useCreateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSubject,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeySubject]);
        },
        onError: (error) => {
        },
    });
};

const useSubject = (params) => {
    return useQuery({
        queryKey: [queryKeySubject, JSON.stringify(params)],
        queryFn: () => fetchSubject(params),
    })
}

const useSubjectByUser = (params) => {
    return useQuery({
        queryKey: params ? [queryKeySubject, JSON.stringify(params)] : null, // Không tạo queryKey nếu params null
        queryFn: () => (params ? fetchSubject(params) : Promise.resolve(null)), // Không fetch nếu params null
        enabled: !!params, // Tắt tự động fetch nếu params không tồn tại
    });
}

const useSubjectMutation = (params) => {
    return useMutation({
        mutationFn: fetchSubject,
        onSuccess: () => {
        },
        onError: (error) => {
        },
    });
}

const useUpdateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateSubject,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeySubject]);
        },
        onError: (error) => {
        },
    });
};

const useDeleteSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletedSubject,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeySubject]);
        },
        onError: (error) => {
        },
    });
};

const useDeletePermanentlySubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletedPermanentlySubject,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeySubject]);
        },
        onError: (error) => {
        },
    });
};

export {
    queryKeySubject,
    useCreateSubject,
    fetchSubject,
    useSubject,
    useSubjectByUser,
    useSubjectMutation,
    useUpdateSubject,
    useDeleteSubject,
    useDeletePermanentlySubject
}
