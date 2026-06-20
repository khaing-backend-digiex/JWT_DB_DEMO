import authorRouter from "./author.route";
import categoryRouter from "./category.route";
import bookRouter from "./book.route";
import userRouter from "./user.route";
import loginRouter from "./login.route";
import registerRouter from "./registed.route";
import { Router } from "express";

const router = Router();

router.use("/author", authorRouter);
router.use("/category", categoryRouter);
router.use("/book", bookRouter);
router.use("/user", userRouter);
router.use("/login", loginRouter);
router.use("/register", registerRouter);

export default router;