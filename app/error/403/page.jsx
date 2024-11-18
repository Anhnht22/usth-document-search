"use client";

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {AlertTriangle, ArrowLeft, Home} from 'lucide-react'
import Link from 'next/link'

export default function Error403Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <AlertTriangle className="h-16 w-16 text-yellow-500"/>
                    </div>
                    <CardTitle className="text-3xl font-bold">403 - Truy cập bị từ chối</CardTitle>
                    <CardDescription className="text-lg mt-2">
                        Xin lỗi, bạn không có quyền truy cập vào trang này.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground">
                        Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với quản trị viên hoặc thử đăng nhập lại.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4"/> Quay lại
                    </Button>
                    <Button asChild>
                        <Link href="/public">
                            <Home className="mr-2 h-4 w-4"/> Trang chủ
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}