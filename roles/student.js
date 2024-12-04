import {actions, rolesGroup} from "@/roles/constants";

const student = {
    [rolesGroup.department]: [actions.read],
    [rolesGroup.document]: [actions.read],
}

export default student;