import {rolesType} from "@/roles/constants";

const base = "/document";

const document = {
    list: {
        title: "Documents",
        path: base,
        roles: [rolesType.admin, rolesType.professor]
    },
    create: {
        title: "Documents Create",
        path: base + "/create",
        roles: [rolesType.admin, rolesType.professor]
    },
    update: {
        title: "Documents Update",
        path: base + "/update/:id",
        roles: [rolesType.admin, rolesType.professor]
    }
};

export default document;
