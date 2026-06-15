import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "pingup-app" });

//Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({event})=>{
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        let username = email_addresses[0].email_address.split('@')[0]


        //ckeck availability of username
        const user = await User
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [];