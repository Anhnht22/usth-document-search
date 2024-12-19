'use client'

import React, {createContext, useContext, useEffect} from 'react'
import Cookies from "js-cookie";
import envConfig from "@/utils/envConfig";
import {useLogin} from "@/hook/useUsers";
import clientRoutes from "@/routes/client";
import {useRouter} from "next/navigation";
import {checkTokenExpiry} from "@/utils/common";
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

    const [userData, setUserData] = React.useState(null);
    const [role, setRole] = React.useState(null);

    const login = (params, callback) => {
        loginApi(params, {
            onSuccess: (response) => {
                const {data: {token}} = response;
                Cookies.set(envConfig.authToken, token, {expires: 30});

                const dataUser = checkTokenExpiry(token);
                setUserData(dataUser.data);
                setRole(dataUser.data.role);

                response.userData = dataUser.data;
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

    useEffect(() => {
        const cookiesToken = Cookies.get(envConfig.authToken);
        const authToken = cookiesToken ? cookiesToken : null;
        const dataUser = authToken ? checkTokenExpiry(authToken) : null;
        const isValidToken = dataUser ? dataUser.isValid : false;

        if (isValidToken) {
            setUserData(dataUser.data);
            setRole(dataUser.data.role);
        }
    }, []);

    const value = {
        // Shared data
        isPendingLogin: isPending,
        role: role,
        userData: userData,

        // Shared functions
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}