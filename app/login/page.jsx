'use client'

import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {EyeIcon, EyeOffIcon} from 'lucide-react'
import {useForm} from "react-hook-form";
import {useLogin} from "@/hook/useUsers";
import envConfig from "@/lib/envConfig";

export default function LoginPage() {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const {mutate: login, isLoading, error} = useLogin();

    const onSubmit = (data) => {
        console.log(data);
        // login(data);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
                        <CardDescription className="text-center">Nhập thông tin đăng nhập của bạn để tiếp
                            tục</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register("email", {required: "Email là bắt buộc"})}
                                />
                                {errors.email &&
                                    <p className="text-red-500 text-xs text-right">{errors.email.message}</p>}
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
                        <Button className="w-full" type="submit">Đăng nhập</Button>
                    </CardFooter>
                    <div className="text-center pb-6">
                        <a href="#" className="text-sm text-blue-600 hover:underline">Quên mật khẩu?</a>
                    </div>
                </form>
            </Card>
        </div>
    )
}