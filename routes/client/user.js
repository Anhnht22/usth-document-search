import {rolesType} from "@/roles/constants";

const base = "/user";

const user = {
    login: {
        title: "Login",
        path: "/login"
    },
    list: {
        title: "Users",
        path: base + "/list",
        roles: [rolesType.admin, rolesType.professor, rolesType.student]
    }
};

export default user;
