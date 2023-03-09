import { createSlice } from "@reduxjs/toolkit";     

const initialState = {                          //state stored in global state
    mode: "light",
    user: null,
    token: null,
    posts: [],
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {                                     //functions that do what you need
        setMode: (state) => {                       //toggles between light mode and dark mode
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            if (state.user) {                       //if user already exists
                state.user.friends = action.payload.friends;
            }
            else {                                  //error
                console.error("user friends non-existent ")
            }
        },
        setPosts: (state, action) => {              //set posts
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {               //set the updated post
            
            const updatedPosts = state.posts.map((post) => {

                if (post._id === action.payload.post._id) return action.payload.post;   //updating only the post coming from the backend
                return post;
            })

            state.posts = updatedPosts;
        },
    },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost} = authSlice.actions;
export default authSlice.reducer;



