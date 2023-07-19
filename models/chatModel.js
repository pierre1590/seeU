import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    partecipants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {    
        type: Date,
        default: Date.now
    },
    received: {
        type: Boolean,
        default: false
    }
});