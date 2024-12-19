import {rolesType} from "@/roles/constants";

const base = "/department";

const department = {
    list: {
        title: "Departments",
        path: base,
        roles: [rolesType.admin, rolesType.professor]
    },
    create: {
        title: "Departments Create",
        path: base + "/create",
        roles: [rolesType.admin, rolesType.professor]
    },
    update: {
        title: "Departments Update",
        path: base + "/update/:id",
        roles: [rolesType.admin, rolesType.professor]
    }
};

export default department;
