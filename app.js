const dotenv = require('dotenv');
dotenv.config();

// Importaciones principales
import express, { json } from "express";
import cors from "cors";
import cron from "node-cron";
import path from "path";
import cookieParser from "cookie-parser";
import { PORT } from "./utility/environment.js";
import { getConnection } from "./db/connection.js";
import { createPageRouter } from "./routes/page.route.js";
import { insertPostEveryMinute } from "./utility/cronJob.js";
import { sessionMiddleware } from './middlewares/SessionAuth.js';
import apiRouter from './api.router.js';

// Conexión a la base de datos
await getConnection();

// Inicialización de la aplicación
const app = express();

// Middlewares
app.use(json()); // Procesar JSON
app.use(cors()); // Habilitar CORS
app.use(cookieParser()); // Habilitar manejo de cookies
app.use(sessionMiddleware);
app.disable("x-powered-by");

// Rutas
app.use("/pages", createPageRouter());
app.use(express.static(path.join(__dirname, "client"))); // Usa la carpeta client
app.get("/", (_, res) => { // Cuando se llama al / devuelve el index
    res.sendFile(path.join(__dirname, "client", "Login/index.html"));
});
app.use('/api', apiRouter); // Redireccion del api router para trabajar las funciones del backend en las solicitudes

// Tareas programadas
cron.schedule("* * * * *", insertPostEveryMinute);

// Inicio del servidor
app.listen(PORT || 5000, () => console.log(`Servidor corriendo en el puerto ${PORT || 5000}`));