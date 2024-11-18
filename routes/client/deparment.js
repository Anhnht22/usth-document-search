import {rolesType} from "@/roles/constants";

const base = "/department";

const department = {
    list: {
        title: "Departments",
        path: base,
        roles: [rolesType.admin, rolesType.professor, rolesType.student]
    },
    detail: {
        title: "Departments",
        path: base + 'detail',
        roles: [rolesType.admin, rolesType.professor, rolesType.student]
    }
};

export default department;
