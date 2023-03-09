import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);     //grab the user feed for the home page
router.get("/:userId/posts", verifyToken, getUserPosts);    //grab the posts of only a specific user

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);      //for liking the posts with the id

export default router;
