'use client'

import {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {EyeIcon, EyeOffIcon} from 'lucide-react'
import {useForm} from "react-hook-form";
import {useLogin} from "@/hook/useUsers";
import envConfig from "@/utils/envConfig";
import Cookies from 'js-cookie';
import clientRoutes from "@/routes/client";
import {useRouter} from "next/navigation";
import {checkTokenExpiry} from "@/utils/common";

export default function LoginPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setError,
        formState: {errors}
    } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const {mutate: login, isPending, isError, error} = useLogin();

    const onSubmit = async (data) => {
        login(data, {
            onSuccess: async (response) => {
                const {data: {token}} = response;
                Cookies.set(envConfig.authToken, token, {expires: 30});
                await router.push(clientRoutes.home);
            },
            onError: (error) => {
                console.log("error: ", error);
                setError("password", {message: "Sai tên đăng nhập hoặc mật khẩu"});
            },
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
                        <CardDescription className="text-center">
                            Nhập thông tin đăng nhập của bạn để tiếp tục
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="you@example.com"
                                    {...register("username", {required: "Username là bắt buộc"})}
                                />
                                {errors.username &&
                                    <p className="text-red-500 text-xs text-right">{errors.username.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Mật khẩu <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...register("password", {required: "Mật khẩu là bắt buộc"})}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-4 w-4 text-gray-500"/>
                                        ) : (
                                            <EyeIcon className="h-4 w-4 text-gray-500"/>
                                        )}
                                    </button>
                                </div>
                            </div>
                            {errors.password &&
                                <p className="text-red-500 text-xs text-right">{errors.password.message}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={isPending}>Đăng nhập</Button>
                    </CardFooter>
                    <div className="text-center pb-6">
                        <a href="#" className="text-sm text-blue-600 hover:underline">Quên mật khẩu?</a>
                    </div>
                </form>
            </Card>
        </div>
    )
}