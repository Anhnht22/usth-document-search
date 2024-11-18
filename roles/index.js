import admin from "@/roles/admin";
import professor from "@/roles/professor";
import student from "@/roles/student";
import {rolesType} from "@/roles/constants";

const roles = {
    [rolesType.admin]: admin,
    [rolesType.professor]: professor,
    [rolesType.student]: student
}

export default roles;
