import {useMutation, useQuery} from '@tanstack/react-query'
import apiRoutes from "@/routes/api";
import ApiBase from "@/hook/base";

const queryKeyUsers = "user";

const fetchUser = async (params) => {
    const response = await new ApiBase().httpGet(apiRoutes.user.list, params);
    const data = await response.json();
    return data.data;
}

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

const useUser = (params) => {
    return useQuery({
        queryKey: [queryKeyUsers, JSON.stringify(params)],
        queryFn: () => fetchUser(params),
    })
}

export {queryKeyUsers, loginUser, useLogin, fetchUser, useUser}
