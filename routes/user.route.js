const { Router } = require("express");
const { loginUser, refreshToken, logoutUser } = require("../controllers/login.controller");
const { createUser, updateUser, deleteUser, getUser, getUsers, sendFriendRequest, respondFriendRequest, getFriendRequests, removeFriend, getFriends } = require("../controllers/user.controller");

const createUserRouter = () => {
    const router = Router();

    router.post("/createUser", createUser);
    router.post("/loginUser", loginUser);
    router.post("/refreshToken", refreshToken);
    router.put("/updateUser/:useremail", updateUser);
    router.delete("/deleteUser/:email", deleteUser);
    router.get("/getUser/:username", getUser);
    router.get("/login/logout", logoutUser);
    router.get("/getUsers", getUsers);
    router.post("/sendFriendRequest", sendFriendRequest);
    router.post("/respondFriendRequest", respondFriendRequest);
    router.get("/getFriendRequests/:email", getFriendRequests);
    router.post("/removeFriend", removeFriend);
    router.get("/getFriends/:email", getFriends);





    return router;
};

module.exports = { createUserRouter };
