import {rolesType} from "@/roles/constants";

const base = "/topic";

const user = {
    list: {
        title: "Topics",
        path: base,
        roles: [rolesType.admin, rolesType.professor]
    }
};

export default user;
