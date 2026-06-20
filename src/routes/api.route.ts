import authorRouter from "./author.route";
import categoryRouter from "./category.route";
import bookRouter from "./book.route";

import type { Application } from "express";

export default (app: Application) => {
    app.use("/author", authorRouter);
    app.use("/category", categoryRouter);
    app.use("/book", bookRouter);
};