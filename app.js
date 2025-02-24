import express from "express";
import cors from "cors";
import cron from "node-cron";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import { PORT } from "./utility/environment.js";
import { getConnection } from "./db/config.js";
import { createPageRouter } from "./routes/page.route.js";
import { createUserRouter } from "./routes/user.route.js";
import { insertPostEveryMinute } from "./utility/cronJob.js";
import { sessionMiddleware } from "./middlewares/SessionAuth.js";

await getConnection();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(sessionMiddleware);
app.disable("x-powered-by");

app.use("/pages", createPageRouter());
app.use("/users", createUserRouter());
app.use(express.static(path.join(__dirname, "client")));
app.get("/", (_, res) => res.sendFile(path.join(__dirname, "client", "Login/index.html")));

// cron.schedule("* * * * *", insertPostEveryMinute);

app.listen(PORT || 5000, () => console.log(`Servidor corriendo en el puerto ${PORT || 5000}`));
