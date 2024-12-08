import {rolesType} from "@/roles/constants";

const base = "/keyword";

const keyword = {
    list: {
        title: "Keywords",
        path: base,
        roles: [rolesType.admin, rolesType.professor]
    }
};

export default keyword;
