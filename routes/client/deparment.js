import {rolesType} from "@/roles/constants";

const base = "/department";

const department = {
    list: {
        title: "Departments",
        path: base,
        roles: [rolesType.admin, rolesType.professor, rolesType.student]
    }
};

export default department;
