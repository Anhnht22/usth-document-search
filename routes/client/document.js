import {rolesType} from "@/roles/constants";

const base = "/document";

const document = {
    list: {
        title: "Documents",
        path: base,
        roles: [rolesType.admin, rolesType.professor]
    }
};

export default document;
