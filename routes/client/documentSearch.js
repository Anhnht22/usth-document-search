import {rolesType} from "@/roles/constants";

const base = "/document-search";

const documentSearch = {
    list: {
        title: "Document Search",
        path: base,
        roles: [rolesType.admin, rolesType.professor, rolesType.student]
    },
    listDepartment: {
        title: "Document Search",
        path: base + "/department",
        roles: [rolesType.admin, rolesType.professor, rolesType.student]
    },
    listSubject: {
        title: "Subject list",
        path: base + "/subject",
        roles: [rolesType.admin, rolesType.professor, rolesType.student]
    },
    listTopic: {
        title: "Topic list",
        path: base + "/topic",
        roles: [rolesType.admin, rolesType.professor, rolesType.student]
    },
};

export default documentSearch;
