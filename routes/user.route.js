const { Router } = require("express"); 
const authMiddleware = require("../middlewares/authMiddleware");
const { loginUser, refreshToken, logoutUser } = require("../controllers/login.controller");
const {
    createUser,
    addCommentToUserPost,
    addCommentToPagePost,
    insertUserPost,
    likeUserPost,
    likePagePost,
    updateUser,
    deleteUser,
    getUser,
    getUsers,
    sendFriendRequest,
    respondFriendRequest,
    getFriendRequests,
    getRecommendedPosts,
    getFriends,
    removeFriend,
    blockUser,
    rejectUser,
    addNotification,
    getNotifications,
    followPage,
    getUserbyEmail,
    getUserPosts,
} = require("../controllers/user.controller");

const createUserRouter = () => {
    const router = Router();

    router.post("/createUser", createUser);
    router.post("/addCommentToUserPost/:commentPostUserEmail/:postId", addCommentToUserPost);
    router.post("/addCommentToPagePost/:pageId/:postId", addCommentToPagePost);
    router.post("/insertUserPost/:email", insertUserPost);
    router.post("/likeUserPost/:likedPostUserEmail/:postId", likeUserPost);
    router.post("/likePagePost/:pageId/:postId", likePagePost);
    router.post("/loginUser", loginUser);
    router.post("/refreshToken", refreshToken);
    router.post("/followPage", followPage);
    router.post("/removeFriend", removeFriend);
    router.post("/sendFriendRequest", sendFriendRequest);
    router.post("/respondFriendRequest", respondFriendRequest);
    router.put("/updateUser/:useremail", updateUser);
    router.put("/blockUser/:email", blockUser);
    router.put("/rejectUser/:email", rejectUser);
    router.delete("/deleteUser/:email", deleteUser);
    router.get("/getUser/:username", getUser);
    router.get("/getUserbyEmail/:email", getUserbyEmail);
    router.get("/login/logout", logoutUser);
    router.get("/getUsers", authMiddleware, getUsers);
    router.get("/getFriendRequests/:email", getFriendRequests);
    router.get("/getRecommendedPosts/:email", getRecommendedPosts);
    router.get("/getFriends/:email", getFriends);
     router.get("/getUserPosts/:email", getUserPosts);
    router.post("/removeFriend", removeFriend);
    router.put("/blockUser/:email", blockUser);
    router.put("/rejectUser/:email", rejectUser);
    router.post("/addNotification/:email", addNotification);
    router.get("/getNotifications/:email", getNotifications);
    router.post("/followPage", followPage); 

    return router;
};

module.exports = { createUserRouter };
