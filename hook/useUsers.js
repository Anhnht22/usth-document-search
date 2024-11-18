import {useMutation} from '@tanstack/react-query'
import apiRoutes from "@/routes/api";
import ApiBase from "@/hook/base";

const queryKeyUsers = "user";

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

export {queryKeyUsers, useLogin, loginUser}
