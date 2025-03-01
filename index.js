const express = require("express"); //Se importa express para poder crear el servidor
const cors = require("cors"); //Se importa cors para poder hacer peticiones desde el front
const cron = require("node-cron"); //Se importa node-cron para poder hacer tareas programadas
const path = require("path"); //Se importa path para poder manejar rutas
const cookieParser = require("cookie-parser"); //Se importa cookie-parser para poder manejar cookies
const { PORT } = require("./utility/environment"); //Se importa el puerto del archivo environment
const { getConnection } = require("./db/config"); //Se importa la función getConnection del archivo config
const { insertPostEveryMinute } = require("./utility/cronJob"); //Se importa la función insertPostEveryMinute del archivo cronJob
const { sessionMiddleware } = require("./middlewares/SessionAuth"); //Se importa la función sessionMiddleware del archivo SessionAuth
const { createAPIRouter } = require("./api.router"); //Se importa la función createAPIRouter del archivo api.router

getConnection(); //Se llama a la funcion getConnection para conectarse con la base de datos 

const app = express(); //Se crea el servidor
app.use(express.json()); //Se habilita el uso de JSON
//app.use(cors()); //Se habilita el uso de cors
app.use(cors({ origin: "*" })); // Permite cualquier origen

app.use(cookieParser()); //Se habilita el uso de cookie-parser
app.use(sessionMiddleware); //Se habilita el uso de sessionMiddleware
app.disable("x-powered-by"); //Se deshabilita la cabecera x-powered-by que viene por defecto en express

app.use("/api", createAPIRouter()); //Se habilita el uso de la ruta /api
app.use(express.static(path.join(__dirname, "client"))); //Se habilita el uso de la carpeta client
app.get("/", (_, res) => res.sendFile(path.join(__dirname, "client", "Login/index.html"))); //Se habilita la ruta / y se envía el archivo index.html
 
// cron.schedule("* * * * *", insertPostEveryMinute); //Se programa la tarea de insertar un post cada minuto

app.listen(PORT || 5000, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT || 5000}`);
});