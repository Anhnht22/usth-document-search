import user from "@/routes/api/user";
import department from "@/routes/api/department";
import role from "@/routes/api/role";
import document from "@/routes/api/document";
import topic from "@/routes/api/topic";

const apiRoutes = {
    user: user,
    department: department,
    role: role,
    document: document,
    topic: topic,
}

export default apiRoutes;