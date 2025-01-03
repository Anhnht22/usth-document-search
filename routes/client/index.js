import user from "@/routes/client/user";
import department from "@/routes/client/deparment";
import error from "@/routes/client/error";
import {rolesType} from "@/roles/constants";
import document from "@/routes/client/document";
import topic from "@/routes/client/topic";
import keyword from "@/routes/client/keyword";
import documentSearch from "@/routes/client/documentSearch";
import subject from "@/routes/client/subject";

// Phân quyền có được vào trang đó hay không
const clientRoutes = {
    error: error,
    home: {
        title: "Dashboard",
        path: "/",
        roles: [rolesType.admin, rolesType.professor, rolesType.student]
    },
    user: user,
    department: department,
    document: document,
    topic: topic,
    keyword: keyword,
    documentSearch: documentSearch,
    subject: subject,
}

export default clientRoutes;