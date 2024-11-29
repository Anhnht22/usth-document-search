import envConfig from "@/utils/envConfig";

const base = envConfig.endPoint + "/user";

const user = {
    login: base + "/login",
    list: base
};

export default user;
