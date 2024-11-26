import envConfig from "@/utils/envConfig";

const base = envConfig.endPoint + "/department";

const department = {
    list: base + "/", // GET
    create: base + "/" // POST
};

export default department;
