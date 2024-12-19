const base = "/document";

const document = {
    list: base,
    search: base + "/search",
    create: base + "/create",
    deletePermanently: base + "/deleted-permanently/:id",
    download: "/static/download",
    update: base + "/update/:id",
};

export default document;
