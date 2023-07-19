import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Chat"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;