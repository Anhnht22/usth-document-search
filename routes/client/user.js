import {rolesType} from "@/roles/constants";

const base = "/user";

const user = {
    login: {
        title: "Login",
        path: "/login"
    },
    list: {
        title: "Users",
        path: base,
        roles: [rolesType.admin, rolesType.professor]
    }
};

export default user;
