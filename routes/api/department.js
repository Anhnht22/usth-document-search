import envConfig from "@/utils/envConfig";

const base = envConfig.endPoint + "/department";

const department = {
    list: base + "/"
};

export default department;
