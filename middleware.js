import envConfig from "@/utils/envConfig";
import {NextResponse} from "next/server";
import clientRoutes from "@/routes/client";
import {checkTokenExpiry} from "@/utils/common";
import {findRoute} from "@/utils/permission";
import {rolesType} from "@/roles/constants";

export function middleware(req) {
    // Chuyển hướng nếu người dùng không đăng nhập
    const cookiesToken = req.cookies.get(envConfig.authToken); // Check trạng thái AuthToken đăng nhập trong cookie
    const authToken = cookiesToken ? cookiesToken.value : null;
    const isValidToken = authToken ? checkTokenExpiry(authToken).isValid : false;

    const pathname = req.nextUrl.pathname;
    const isLoginPage = pathname === clientRoutes.user.login.path;

    let redirectUrl = null;
    if (isValidToken) {
        if (isLoginPage) { // Nếu token hợp lệ và đang ở trang login thì chuyển hướng về trang chính
            redirectUrl = clientRoutes.home.path;
        } else { // Kiểm tra quyền truy cập
            /**
             * TODO: Tạm thời để mặc định quyền amdin
             * @type {string}
             */
            const role = rolesType.admin; //req.cookies.get(envConfig.authRole)?.value;
            const currentRoute = findRoute(clientRoutes, pathname);

            if (!currentRoute) { // Nếu không tìm thấy route, chuyển hướng đến 404
                redirectUrl = clientRoutes.error[404];
            } else if (typeof currentRoute !== 'string') { // Kiểm tra quyền truy cập
                const roles = currentRoute.roles;
                if (!roles || !roles.includes(role)) { // Nếu không đủ quyền, chuyển hướng đến 403
                    redirectUrl = clientRoutes.error[403];
                }
            }
        }
    } else if (!isLoginPage) { // Nếu token không hợp lệ và không phải trang login thì chuyển hướng về trang login
        redirectUrl = clientRoutes.user.login.path;
    }

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
