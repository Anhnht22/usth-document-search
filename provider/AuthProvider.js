'use client'

import React, {createContext, useContext} from 'react'
import Cookies from "js-cookie";
import envConfig from "@/utils/envConfig";
import {useLogin} from "@/hook/useUsers";
import clientRoutes from "@/routes/client";
import {useRouter} from "next/navigation";
// Create the context
const AuthContext = createContext()

// Create a custom hook to use the context
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider')
    }
    return context
}

// Create the provider component
export const AuthProvider = ({children}) => {
    const router = useRouter();

    const {mutate: loginApi, isPending} = useLogin();

    const login = (params, callback) => {
        loginApi(params, {
            onSuccess: (response) => {
                const {data: {token}} = response;
                Cookies.set(envConfig.authToken, token, {expires: 30});
                callback?.(response, null);
            },
            onError: (error) => {
                console.log("error: ", error);
                callback?.(null, error);
            },
        });
    }

    const logout = async () => {
        Cookies.remove(envConfig.authToken);
        await router.push(clientRoutes.user.login.path);
    }

    const value = {
        // Shared data
        isPendingLogin: isPending,

        // Shared functions
        login,
        logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}