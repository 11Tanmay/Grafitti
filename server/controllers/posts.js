import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async(req, res) => {      //this will have a picture passed through the middleware
    try {
        const { userId, description, picturePath } = req.body;      //getting the required parametres from the frontend
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })

        await newPost.save();                       //saving the new post to the database
        
        const post = await Post.find();             //grabbing all the saved post from the database for the frontend
        res.status(201).json(post);
    }
    catch (err) {
        res.status(409).json({ message: err.message })
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();             //grabbing all the saved post from the database for the frontend
        res.status(200).json(post);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;              //
        const post = await Post.find({ userId });   //grabbing all the saved post of a particular user
        res.status(200).json(post);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;      //post id comes from the req parametres
        const { userId } = req.body;    //user id comes from the req body
        const post = await Post.findById(id);       //getting details of the post that is liked from the database
        const isLiked = post.likes.get(userId);     //checking if the user already likes the post

        if(isLiked) {
            post.likes.delete(userId)       //if the user has already liked the post delete the user from the likes to unlike it
        }
        else {
            post.likes.set(userId, true);   //if the user has not liked the post add him to the likes to like the post
        }

        const updatedPost = await Post.findByIdAndUpdate(   //updating the database
            id,                                             //finding the document to update
            { likes: post.likes },                          //the document fields to be updated
            { new: true }                                   //gives the updated post and not the original one before update
        );

        res.status(200).json(updatedPost);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}
