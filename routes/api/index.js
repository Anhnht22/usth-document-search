import user from "@/routes/api/user";
import department from "@/routes/api/department";
import role from "@/routes/api/role";
import document from "@/routes/api/document";
import topic from "@/routes/api/topic";
import subject from "@/routes/api/subject";
import keyword from "@/routes/api/keyword";

const apiRoutes = {
    user: user,
    department: department,
    role: role,
    document: document,
    topic: topic,
    subject: subject,
    keyword: keyword,
}

export default apiRoutes;