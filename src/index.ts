import express from "express";
import { SERVER_CONFIG } from "./constant/constant";
import bookRoutes from "./routes/book.route";
import authorRoutes from "./routes/author.route";
import categoryRoutes from "./routes/category.route";
import { testDbConnection } from "./database";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.body:', req.body);
    next();
});
import loginRoutes from "./routes/login.route";
import registerRoutes from "./routes/registed.route";
import userRoutes from "./routes/user.route";
import { globalErrorHandler } from "./middleware/error.middleware";

app.use("/book", bookRoutes);
app.use("/author", authorRoutes);
app.use("/category", categoryRoutes);
app.use("/user", userRoutes);
app.use(loginRoutes);
app.use(registerRoutes);

app.use(globalErrorHandler);

app.listen(SERVER_CONFIG.PORT, async () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${SERVER_CONFIG.PORT}`);


  await testDbConnection();
});