import User from "../models/User";


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
        const {username, bio, location, full_name} = req.body;
        const tempUser = await User.findById(userId);

        !username && (username = tempUser.username);

         if(tempUser.username !== username){
            const user = User.findOne({username});
            if(user){
                //we will not change the username if it is already taken
                username = tempUser.username;
            }
        }

        const updateData ={
            username,
            bio,
            location,
            full_name
        };
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}