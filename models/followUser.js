// Follow model
import mongoose from "mongoose";

const followSchema = mongoose.Schema({
   followerID: {
         type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
    },
    followingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Follow = mongoose.model("Follow", followSchema);

export default Follow;