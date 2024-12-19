import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import apiRoutes from "@/routes/api";
import ApiBase from "@/hook/base";

const queryKeyDepartments = "departments";

const fetchDepartments = async (params) => {
    const response = await new ApiBase().httpGet(apiRoutes.department.list, params);
    return await response.json();
}

const createDepartment = async (params) => {
    const response = await new ApiBase().httpPost(apiRoutes.department.create, params);
    return await response.json();
};

const deleteDepartment = async (id) => {
    const response = await new ApiBase().httpDelete(apiRoutes.department.delete.replace(":id", id));
    return await response.json();
};

const deletedPermanentlyDepartment = async (id) => {
    const response = await new ApiBase().httpDelete(apiRoutes.department.deletePermanently.replace(":id", id));
    return await response.json();
};

const updateDepartment = async ({id, params}) => {
    const response = await new ApiBase().httpPut(apiRoutes.department.update.replace(":id", id), params);
    return await response.json();
};

const useDepartments = (params) => {
    return useQuery({
        queryKey: [queryKeyDepartments, JSON.stringify(params)],
        queryFn: () => fetchDepartments(params),
    })
}

const useDepartmentsByUser = (params) => {
    return useQuery({
        queryKey: params ? [queryKeyDepartments, JSON.stringify(params)] : null, // Không tạo queryKey nếu params null
        queryFn: () => (params ? fetchDepartments(params) : Promise.resolve(null)), // Không fetch nếu params null
        enabled: !!params, // Tắt tự động fetch nếu params không tồn tại
    });
}

const useCreateDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyDepartments]);
        },
        onError: (error) => {
        },
    });
};

const useDeleteDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyDepartments]);
        },
        onError: (error) => {
        },
    });
};

const useDeletePermanentlyDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletedPermanentlyDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyDepartments]);
        },
        onError: (error) => {
        },
    });
};

const useUpdateDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyDepartments]);
        },
        onError: (error) => {
        },
    });
};

export {
    queryKeyDepartments,
    useDepartments,
    useDepartmentsByUser,
    useCreateDepartment,
    useDeleteDepartment,
    useDeletePermanentlyDepartment,
    useUpdateDepartment,
    fetchDepartments
}
