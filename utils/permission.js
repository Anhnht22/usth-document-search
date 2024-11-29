import roles from "@/roles";

// Hàm kiểm tra khớp route (bao gồm dynamic route)
const isRouteMatch = (templatePath, actualPath) => {
    // Chuyển template thành regex (ví dụ: "/user/:id" thành "/user/[^/]+$")
    const normalizedTemplatePath = templatePath.replace(/\/+$/, '');
    const normalizedActualPath = actualPath.replace(/\/+$/, '');

    const regex = new RegExp(`^${normalizedTemplatePath.replace(/:\w+/g, '[^/]+')}$`);

    return regex.test(normalizedActualPath);
};

// Hàm đệ quy tìm route
function findRoute(routes, path) {
    for (const key in routes) {
        if (typeof routes[key] === 'object') {
            if (routes[key].path) {
                if (isRouteMatch(routes[key].path, path)) {
                    return routes[key];
                }
            } else {
                const found = findRoute(routes[key], path);
                if (found) return found;
            }
        } else if (routes[key] === path) {
            return routes[key];
        }
    }
    return null;
}

const validRoleAction = (role, functionality, action) => {
    return roles[role][functionality].includes(action);
}

export {
    findRoute,
    validRoleAction
}