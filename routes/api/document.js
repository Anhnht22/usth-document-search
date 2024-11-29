import envConfig from "@/utils/envConfig";

const base = envConfig.endPoint + "/document";

const document = {
    list: base + "/", // GET
    create: base + "/" // POST
};

export default document;
