import roles from "@/roles";

const findRouteRecursive = (routes, pathname, userRole) => {
    for (const key in routes) {
        const route = routes[key];

        if (typeof route === "string" && route === pathname) {
            return true; // Nếu route không phân quyền thì mặc định có quyền
        }

        if (route.path === pathname) {
            return route.roles.includes(userRole); // Nếu tìm thấy đường dẫn, kiểm tra quyền
        }

        // Nếu route là một object chứa các cấp con
        if (typeof route === "object" && !Array.isArray(route)) {
            if (findRouteRecursive(route, pathname, userRole)) {
                return true; // Nếu tìm thấy route con thì trả về true
            }
        }
    }

    return false; // Không tìm thấy route hoặc không có quyền
}

const validRoleAction = (role, functionality, action) => {
    return roles[role][functionality].includes(action);
}

export {
    findRouteRecursive,
    validRoleAction
}