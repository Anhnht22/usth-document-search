import envConfig from "@/utils/envConfig";

const base = envConfig.endPoint + "/user";

const user = {
    login: base + "/login",
    list: base + "/list"
};

export default user;
