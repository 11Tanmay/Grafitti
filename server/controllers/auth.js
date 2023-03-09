import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";     //way to send a web token to the user so that they can use it for authorisation
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {       //when we make a call to mongoose database it has to be asynchronous
                                                    //req provides us the request body that we get from the frontend and res is what we will send to the frontend 
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;                           //client will send these parametres from the frontend

        const salt = await bcrypt.genSalt();    //salt for password encryption
        const passwordHash = await bcrypt.hash(password, salt);     //encrypting the password with the salt

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,             //storing hashed password
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })
        const savedUser = await newUser.save();
        savedUser.password = "";             //deleting the password so that it is not sent to the frontend
        res.status(201).json(savedUser);        //if no error we will send the user this json object and status code - 201-something has been created
    }
    catch (err) {
        res.status(500).json({ error: err.message });   //frontend will get this error message
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });          //finding user in the database
        if (!user) return res.status(400).json({msg: "User does not exist. "});     //user not found in the database

        const isMatch = await bcrypt.compare(password, user.password);      //checking if the password is same as the one hashed in the database
        if(!isMatch) return res.status(400).json({ msg: "Invalid credentials. "});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);       
        user.password = "";       //deleting the password so that it is not sent back to the frontend
        res.status(200).json({ token, user });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
