import user from "@/routes/api/user";
import department from "@/routes/api/department";
import role from "@/routes/api/role";
import document from "@/routes/api/document";

const apiRoutes = {
    user: user,
    department: department,
    role: role,
    document: document,
}

export default apiRoutes;