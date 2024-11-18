import user from "@/routes/client/user";
import department from "@/routes/client/deparment";
import error from "@/routes/client/error";

import {rolesType} from "@/roles/constants";

const clientRoutes = {
    error: error,
    home: {
        title: "Dashboard",
        path: "/",
        roles: [rolesType.admin, rolesType.professor, rolesType.student]
    },
    user: user,
    department: department
}

export default clientRoutes;