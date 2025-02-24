const express = require('express');
const apiRouter = express.Router();

// Importacion del router del usuario y curso
const userRouter = require('./routes/user.route')

// Redireccion al router de usuarios y cursos
apiRouter.use('/users', userRouter);

module.exports = apiRouter