import { Inngest } from "inngest";
import User from '../models/User.js';

// Create a client to send and receive events
export const inngest = new Inngest({ id: "pingup-app" });

//Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [
      {
        event: "clerk/user.created",
      },
    ],
  },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    let username = email_addresses[0].email_address.split("@")[0];

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      username = username + Math.floor(Math.random() * 1000);
    }

    await User.create({
      _id: id,
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
      username,
    });
  }
);


//Inngest Function to update user data in the database
const syncUserUpdate = inngest.createFunction(
    {
      id: "update-user-from-clerk",
      triggers: [
        {
          event: "clerk/user.updated",
        },
      ],
    },
    async ({event})=>{
        const {id, first_name, last_name, email_addresses, image_url} = event.data

    const updateUserData = {
        email: email_addresses[0].email_address,
        full_name: first_name + ' ' + last_name,
        profile_picture: image_url, 
    }
    // Update the user data in the database
    await User.findByIdAndUpdate(id, updateUserData);
  }
)


//Inngest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
    {
      id: "delete-user-from-clerk",
      triggers: [
        {
          event: "clerk/user.deleted",
        },
      ],
    },
    async ({event})=>{
        const {id} = event.data
        // Delete the user from the database
        await User.findByIdAndDelete(id);
    }
)



// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation, 
    syncUserUpdate,
    syncUserDeletion];