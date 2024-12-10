import envConfig from "@/utils/envConfig";

const base = envConfig.endPoint + "/keyword";

const keyword = {
    list: base,
    create: base + "/create",
    deletePermanently: base + "/deleted-permanently/:id",
    update: base + "/update/:id",
};

export default keyword;
