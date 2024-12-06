import envConfig from "@/utils/envConfig";

const base = envConfig.endPoint + "/document";

const document = {
    list: base,
    create: base + "/create",
    deletePermanently: base + "/deleted-permanently/:id",
    update: base + "/update/:id",
};

export default document;
