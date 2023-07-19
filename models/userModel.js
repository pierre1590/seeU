import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
    },
    fullname: {
        type: String,
    },
    country:{
        type: String,
    },
    avatar: {
        type: String,       
    },
});

// Function to check if the password are matching
userSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Function to hash the password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userSchema);

export default User;