import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

// Create a new chat
export const createChat = async (req, res) => {
    try {
        const { partecipants, name } = req.body;
        //Verify that the partecipants are valid
        const partecipantsExist = await User.find({ _id: { $in: partecipants } });

        if(partecipantsExist.length !== partecipants.length) {
            return res.status(400).json({ error: "One or more partecipants don't exist" });
        }

        //Verify that the chat doesn't already exist
        const chatExist = await Chat.findOne({ partecipants: { $all: partecipants } });

        if(chatExist) {
            return res.status(400).json({ error: "Chat already exists" });
        }

        //Create the chat
        const chat = await Chat.create({ partecipants, name });

        return res.status(201).json(chat);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

};


// Get all chats of a user
export const getChats = async (req, res) => {
try {
    const userId = req.params.id;

    //Verify that the user exists in the database
    const userExists = await User.findById(userId);

    if(!userExists) {
        return res.status(400).json({ error: "User doesn't exist" });
    }

    const chats = await Chat.find({ partecipants: userId });

    return res.status(200).json(chats);

} catch (error) {
    return res.status(500).json({ error: error.message });
}
};

