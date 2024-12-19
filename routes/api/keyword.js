const base = "/keyword";

const keyword = {
    list: base,
    create: base + "/create",
    deletePermanently: base + "/deleted-permanently/:id",
    update: base + "/update/:id",
};

export default keyword;
