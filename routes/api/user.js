const base = "/user";

const user = {
    login: base + "/login",
    list: base,
    create: base + "/create",
    deletePermanently: base + "/deleted-permanently/:id",
    update: base + "/update/:id",
    updatePassword: base + "/update-password/:id",
};

export default user;
