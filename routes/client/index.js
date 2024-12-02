import user from "@/routes/client/user";
import department from "@/routes/client/deparment";
import error from "@/routes/client/error";
import {rolesType} from "@/roles/constants";
import document from "@/routes/client/document";

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
}

export default clientRoutes;