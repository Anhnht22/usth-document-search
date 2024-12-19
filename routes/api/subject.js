const base = "/subject";

const topic = {
    list: base,
    create: base + "/create",
    delete: base + "/deleted/:id",
    deletePermanently: base + "/deleted-permanently/:id",
    update: base + "/update/:id",
};

export default topic;
