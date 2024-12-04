import {actions, rolesGroup, rolesType} from "@/roles/constants";

const roles = {
    [rolesGroup.department]: {
        [rolesType.admin]: [actions.create, actions.read, actions.update, actions.delete],
        [rolesType.professor]: [actions.create, actions.read, actions.update, actions.delete],
        [rolesType.student]: [actions.read],
    },
    [rolesGroup.document]: {
        [rolesType.admin]: [actions.create, actions.read, actions.update, actions.delete],
        [rolesType.professor]: [actions.create, actions.read, actions.update, actions.delete],
        [rolesType.student]: [actions.read],
    },
}

export default roles;
