'use client'

import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {useAuth} from "@/provider/AuthProvider";
import clientRoutes from "@/routes/client";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {cn} from "@/lib/utils";
import {EyeIcon, EyeOffIcon} from "lucide-react";
import md5 from 'md5';

const formSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required!",
    }),
    password: z.string().min(1, {
        message: "Password is required!",
    }),
})

export default function LoginPage() {
    const {isPendingLogin, login} = useAuth();

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = (data) => {
        login({
            ...data,
            password: md5(data.password)
        }, async (response, error) => {
            if (error) {
                form.setError("password", {message: "Wrong username or password!"});
            } else {
                await router.push(clientRoutes.home.path);
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <Form {...form}>
                    <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                            <CardDescription className="text-center">
                                Enter your login information to continue
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("text-black")}>
                                                Username
                                                <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Username..." {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={cn("text-black")}>
                                                Password
                                                <span className="text-red-500"> *</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className={cn("relative")}>
                                                    <Input type={showPassword ? "text" : "password"}
                                                           placeholder="••••••••" {...field}/>
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
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" type="submit" disabled={isPendingLogin}>Login</Button>
                        </CardFooter>
                        <div className="text-center pb-6">
                            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    )
}