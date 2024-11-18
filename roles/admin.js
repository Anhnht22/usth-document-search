import {actions, rolesGroup} from "@/roles/constants";

const admin = {
    [rolesGroup.department]: [actions.create, actions.read, actions.update, actions.delete]
}

export default admin;