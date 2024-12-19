import {rolesType} from "@/roles/constants";

const base = "/subject";

const subject = {
    list: {
        title: "Subject",
        path: base,
        roles: [rolesType.admin, rolesType.professor]
    },
    create: {
        title: "Subject Create",
        path: base + "/create",
        roles: [rolesType.admin, rolesType.professor]
    },
    update: {
        title: "Subject Update",
        path: base + "/update/:id",
        roles: [rolesType.admin, rolesType.professor]
    }
};

export default subject;
