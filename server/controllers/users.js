import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;              //getting user id from the request
        const user = await User.findById(id);   //getting all details from the database
        res.status(200).json(user);             //sending back the details to the frontend
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;              //getting user id from the request
        const user = await User.findById(id);   //getting all details from the database

        const friends = await Promise.all(                  //for all friends in the friends list
            user.friends.map((id) => User.findById(id))     //replace the friends id with the friends details
        );
        const formattedFriends = friends.map(               //changing the schema for the frontend
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);             //sending the friends list to the frontend
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {

        console.log(req.params);

        const { id, friendId } = req.params;           //grabbing both our and friends id
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        console.log(user);
        console.log(friend);

        if(user.friends.includes(friendId)) {  //checking if the friendsId is already in the frinds list of the user
            user.friends = user.friends.filter((fId) => fId !== friendId);              //removing that friend from the friends list of the user
            friend.friends = friend.friends.filter((uId) => uId !== id);                //removing the user from the friend list of the friend
        }
        else {                                          //if the friendId is not a friend
            user.friends.push(friendId);                //adding the friendId to the friends list of the user
            friend.friends.push(id);                    //adding the user to the friends list of the friendId
        }
        await user.save();                              //saving the changes int the database
        await friend.save();

        //for updating the frontend
        const friends = await Promise.all(                  //for all friends in the friends list
            user.friends.map((id) => User.findById(id))     //replace the friends id with the friends details
        );
        const formattedFriends = friends.map(               //changing the schema for the frontend
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        
        res.status(200).json(formattedFriends);
    }
    catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
}

