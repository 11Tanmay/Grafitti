import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ routes - don't change anything in the database */
router.get("/:id", verifyToken, getUser);       //verifyToken is the middleware that is executed before getUser
router.get("/:id/friends", verifyToken, getUserFriends);    //retrieve friends of a user

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);        //to friend or unfriend we need two ids one ours and one of our friend

export default router;
