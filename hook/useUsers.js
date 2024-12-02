import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import apiRoutes from "@/routes/api";
import ApiBase from "@/hook/base";

const queryKeyUsers = "user";

const fetchUser = async (params) => {
    const response = await new ApiBase().httpGet(apiRoutes.user.list, params);
    return await response.json();
}

const createUser = async (params) => {
    const response = await new ApiBase().httpPost(apiRoutes.user.create, params);
    return await response.json();
};

const loginUser = async (params) => {
    const response = await new ApiBase().httpPost(apiRoutes.user.login, params);
    const data = await response.json();

    if (!response.ok) throw data;

    return data;
}

const useLogin = () => {
    return useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
        },
        onError: () => {
        },
    });
}

const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyUsers]);
        },
        onError: (error) => {
        },
    });
};

const useUser = (params) => {
    return useQuery({
        queryKey: [queryKeyUsers, JSON.stringify(params)],
        queryFn: () => fetchUser(params),
    })
}

export {
    queryKeyUsers,
    loginUser,
    useLogin,
    useCreateUser,
    fetchUser,
    useUser
}
