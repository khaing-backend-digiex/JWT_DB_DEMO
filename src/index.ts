import express from "express";
import { SERVER_CONFIG } from "./constant/constant";
import { testDbConnection } from "./database";
import { loadPermissionsToRAM } from "./cache/permission.cache";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.body:', req.body);
    next();
});
import apiRoutes from "./routes/api.route";
import { globalErrorHandler } from "./middleware/error.middleware";

app.use("/api", apiRoutes);

app.use(globalErrorHandler);

app.listen(SERVER_CONFIG.PORT, async () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${SERVER_CONFIG.PORT}`);


  await testDbConnection();
  await loadPermissionsToRAM();
});