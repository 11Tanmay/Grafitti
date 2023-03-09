import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: {
            type: String,
        },
        description: String,
        picturePath: String,
        userPicturePath: String,
        likes: {
            type: Map,              //storing user id that liked the post in a map as it is more efficient
            of: Boolean,            //boolean value whether the picture is liked or not
        },
        comments: {
            type: Array,
            default: [],
        }
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
