const express = require("express");
const { createUser, updateUser, deleteUser, getUser, registerPurchase, getPurchasesByUser } = require("../controllers/user.controller");
const { loginUser, getUserInSession, logoutUser, refreshAccessToken } = require("../controllers/login.controller");

const router = express.Router();
router.get("/:username", getUser);
router.post("/", createUser);
router.put("/:name", updateUser);
router.delete("/:username", deleteUser);
router.post("/:username/purchase", registerPurchase);
router.get("/:username/purchase", getPurchasesByUser);

router.post("/login", loginUser); 
router.get("/login/session", getUserInSession); 
router.get("/login/logout", logoutUser);
router.post("/refresh-token", refreshAccessToken); // Nueva ruta para refrescar el access token

module.exports = router;