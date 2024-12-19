const base = "/topic";

const topic = {
    list: base,
    create: base + "/create",
    deletePermanently: base + "/deleted-permanently/:id",
    update: base + "/update/:id",
};

export default topic;
