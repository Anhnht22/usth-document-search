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
    },
    create: {
        title: "Users Create",
        path: base + "/create",
        roles: [rolesType.admin, rolesType.professor]
    },
    update: {
        title: "Users Update",
        path: base + "/update/:id",
        roles: [rolesType.admin, rolesType.professor]
    }
};

export default user;
