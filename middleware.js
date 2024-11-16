import envConfig from "@/utils/envConfig";
import {NextResponse} from "next/server";
import clientRoutes from "@/routes/client";
import {checkTokenExpiry} from "@/utils/common";

export function middleware(req) {
    // Ví dụ: Chuyển hướng nếu người dùng không đăng nhập
    const cookiesToken = req.cookies.get(envConfig.authToken); // Check trạng thái AuthToken đăng nhập trong cookie
    const authToken = cookiesToken ? cookiesToken.value : null;
    const isValidToken = authToken ? checkTokenExpiry(authToken).isValid : false;

    const isLoginPage = req.nextUrl.pathname === clientRoutes.user.login;

    let redirectUrl = null;
    if (isValidToken) {
        if (isLoginPage) redirectUrl = clientRoutes.home; // Nếu token hợp lệ và đang ở trang login thì chuyển hướng về trang chính
    } else if (!isLoginPage) { // Nếu token không hợp lệ và không phải trang login thì chuyển hướng về trang login
        redirectUrl = clientRoutes.user.login;
    }

    console.log("isValidToken: ", isValidToken);
    console.log("isLoginPage: ", isLoginPage);
    console.log("redirectUrl: ", redirectUrl);

    if (redirectUrl) {
        const url = req.nextUrl.clone();
        url.pathname = redirectUrl;
        return NextResponse.redirect(url);
    }

    // Nếu không có gì đặc biệt, tiếp tục xử lý request
    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)', // Định nghĩa các route mà middleware áp dụng
};