import express, { json } from "express";
import cors from "cors";
import { PORT } from "./utility/environment.js";
import { getConnection } from "./db/connection.js";
import { createPageRouter } from "./routes/page.route.js";

await getConnection();

const app = express();
app.use(json());
app.use(cors());
app.disable("x-powered-by");
app.use("/pages", createPageRouter());

app.listen(PORT || 5000, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
