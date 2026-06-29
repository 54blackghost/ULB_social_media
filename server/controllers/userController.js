import User from "../models/User.js";
import client from "../configs/imagesKit.js";
import fs from "fs";


// Get User Data using userId
export const getUserData = async (req, res) => {
    try {
        const {userId} = await req.auth();
        const user = await User.findById(userId);
        if (!user) {
            return res.json({success: false, message: 'User not found'});
        }
        res.json({success: true, data: user});
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}



// Update User Data 

export const updateUserData = async (req, res) => {
    try {
        const {userId} = await req.auth();
        let {username, bio, location, full_name} = req.body;


        const tempUser = await User.findById(userId);

        !username && (username = tempUser.username);

         if(tempUser.username !== username){
            const user = await User.findOne({username});
            if(user){
                //we will not change the username if it is already taken
                username = tempUser.username;
            }
        }

        const updateData ={
            username,
            bio: bio ?? tempUser.bio,
            location: location ?? tempUser.location,
            full_name: full_name ?? tempUser.full_name,
        };

        const profile = req.files?.profile?.[0];
        const cover = req.files?.cover?.[0];

        if(profile){
            const buffer = fs.readFileSync(profile.path);
            const response = await client.files.upload({
                file: buffer,
                fileName: profile.originalname,
            });
            
            const url = client.url({
                path: response.filePath,
                transformation: [
                    {quality: "auto"},
                    {format: "webp"},
                    {width: "512"},

                    ],
            });
            updateData.profile_picture = url;
        }


        if(cover){
            const buffer = fs.readFileSync(cover.path);
            const response = await client.files.upload({
                file: buffer,
                fileName: cover.originalname,
            });
            
            const url = client.url({
                path: response.filePath,
                transformation: [
                    {quality: "auto"},
                    {format: "webp"},
                    {width: "1280"},

                    ],
            });
            updateData.cover_photo = url;
        }

        const user =  await User.findByIdAndUpdate(userId, updateData, {new: true});
        
        res.json({success: true, user, message: "Profile updated successfully"});


    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}


//find Users using username, email, name, location
export const discoverUsers = async (req, res) => {
    try {
        const {userId} = await req.auth();
        const {input} = req.body;

        const allUsers = await User.find(
            {
                $or: [
                    {username: new RegExp(input, 'i')},
                    {email: new RegExp(input, 'i')},
                    {full_name: new RegExp(input, 'i')},
                    {location: new RegExp(input, 'i')},
                ]
            }
        )
        const filteredUsers = allUsers.filter(user => user._id !== userId);
        res.json({success: true, users: filteredUsers});
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

//Follow User
export const followUser = async (req, res) => {
    try {
        const {userId} = await req.auth();
        const {id} = req.body;

        const user = await User.findById(userId);

        if(user.following.includes(id)){
            return res.json({success: false, message: 'You are already following this user'});
        }    

        user.following.push(id);
        await user.save();

        const toUser = await User.findById(id);
        toUser.followers.push(userId);
        await toUser.save();

        res.json({success: true, message: 'User followed successfully'});

  
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

//Unfollow User

export const unfollowUser = async (req, res) => {
    try {
        const {userId} = await req.auth();
        const {id} = req.body;

        const user = await User.findById(userId);

       user.following = user.following.filter(user=> user !== id);
       await user.save();

       const toUser = await User.findById(id);
       toUser.followers = toUser.followers.filter(user=> user !== userId);
       await toUser.save();

        res.json({success: true, message: 'You are no longer following this user'});

  
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}
