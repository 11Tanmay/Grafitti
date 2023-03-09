import express from "express";          //import being used instead of require due to type: module in package.json
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";    //allow us to properly set paths when we configure directories
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";   //controller to register user
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

// Most of these configuration information is coming from package instructions


/* CONFIGURATIONS - Middleware-something that runs in between different requests*/
const __filename = fileURLToPath(import.meta.url);      //so that we can use directory name
const __dirname = path.dirname(__filename);
dotenv.config();                                        //so that we can use dotenv files
const app = express();                                  // invoke express
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" , extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));      //sets up the directory where we keep out assets (images)

/* FILE STORAGE */              
const storage = multer.diskStorage({
    destination: function (req, file, cb) {         //when someone uploads a file to the website it will be stored to this location
        cb(null, "public/assets");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });                 //to be used when we need to upload a file

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);     //route to be accessed to authenticate
app.post("/posts", verifyToken, upload.single("picture"), createPost);      //to create a post first verify token and the upload a picture

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;              //setting up the port to run the server
mongoose                                            //connecting to the mongodb server
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => console.log('Server Port: '+ PORT));

        /* ADD DATA ONE TIME */                     //adding sample data into the database
        // User.insertMany(users);
        // Post.insertMany(posts);
    })
    .catch((error) => console.log(error +'did not connect'));     //catching if an error occurs


