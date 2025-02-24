import express, { json } from "express";
import cors from "cors";
import cron from "node-cron";
import { PORT } from "./utility/environment.js";
import { getConnection } from "./db/connection.js";
import { createPageRouter } from "./routes/page.route.js";
import { insertPostEveryMinute } from "./utility/cronJob.js";

await getConnection();

const app = express();
app.use(json());
app.use(cors());
app.disable("x-powered-by");
app.use("/pages", createPageRouter());

cron.schedule("* * * * *", insertPostEveryMinute);

app.listen(PORT || 5000, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

