const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const path = require("path");
const cookieParser = require("cookie-parser");
const { PORT } = require("./utility/environment");
const { getConnection } = require("./db/config");
const { insertPostEveryMinute } = require("./utility/cronJob");
const { sessionMiddleware } = require("./middlewares/SessionAuth");
const { createAPIRouter } = require("./api.router");

getConnection();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(sessionMiddleware);
app.disable("x-powered-by");

app.use("/api", createAPIRouter());
app.use(express.static(path.join(__dirname, "client")));
app.get("/", (_, res) => res.sendFile(path.join(__dirname, "client", "Login/index.html")));

// cron.schedule("* * * * *", insertPostEveryMinute);

app.listen(PORT || 5000, () => console.log(`Servidor corriendo en el puerto ${PORT || 5000}`));
