const { Router } = require("express");
const { loginUser, refreshToken, logoutUser } = require("../controllers/login.controller");
const {
    createUser,
    insertUserPost,
    updateUser,
    deleteUser,
    getUser,
    getUsers,
    sendFriendRequest,
    respondFriendRequest,
    getFriendRequests,
    getRecommendedPosts,
} = require("../controllers/user.controller");

const createUserRouter = () => {
    const router = Router();

    router.post("/createUser", createUser);
    router.post("/insertUserPost/:email", insertUserPost);
    router.post("/loginUser", loginUser);
    router.post("/refreshToken", refreshToken);
    router.put("/updateUser/:useremail", updateUser);
    router.delete("/deleteUser/:email", deleteUser);
    router.get("/getUser/:username", getUser);
    router.get("/login/logout", logoutUser);
    router.get("/getUsers", getUsers);
    router.post("/sendFriendRequest", sendFriendRequest);
    router.post("/respondFriendRequest", respondFriendRequest);
    router.get("/getFriendRequests/:username", getFriendRequests);
    router.get("/getRecommendedPosts/:email", getRecommendedPosts);

    return router;
};

module.exports = { createUserRouter };
