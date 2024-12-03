import envConfig from "@/utils/envConfig";

const base = envConfig.endPoint + "/user";

const user = {
    login: base + "/login",
    list: base,
    create: base + "/create",
    deletePermanently: base + "/deleted-permanently/:id",
    update: base + "/update/:id",
};

export default user;
