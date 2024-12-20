const base = "/department";

const department = {
    list: base + "", // GET
    create: base + "/create", // POST
    delete: base + "/delete/:id", // DELETE
    deletePermanently: base + "/deleted-permanently/:id", // DELETE
    update: base + "/update/:id", // PUT
};

export default department;
