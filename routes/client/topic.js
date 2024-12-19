import {rolesType} from "@/roles/constants";

const base = "/topic";

const user = {
    list: {
        title: "Topics",
        path: base,
        roles: [rolesType.admin, rolesType.professor]
    },
    create: {
        title: "Topics Create",
        path: base + "/create",
        roles: [rolesType.admin, rolesType.professor]
    },
    update: {
        title: "Topics Update",
        path: base + "/update/:id",
        roles: [rolesType.admin, rolesType.professor]
    }
};

export default user;
