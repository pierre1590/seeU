import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// @desc    Auth user & get token
// @route   POST /users/login
// @access  Public
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Check if the user exists and the password is matching
    if (user && (await user.matchPasswords(password))) {
        // Generate a token
        const token = generateToken(user._id,'access');
        // Send the token to the frontend
        res.json({
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            country: user.country,
            avatar: user.avatar,
            token,
            message: "User logged in",
        });
    } else if (!user) {
       res.status(404).json({ message: "User not found" });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
    });

// @desc    Register a new user
// @route   POST /users/register
// @access  Public

const registerUser = asyncHandler(async(req, res) => {
    const { email, password,fullname,avatar, country } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: "Email already exists" });
    } else {
        const user = await User.create({
            email,
            password,
            fullname,
            country,
            avatar,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                country: user.country,
                avatar: user.avatar,
                message: "User created",
                token: generateToken(user._id,'access'),
            });
        } else {
            res.status(400).json({ message: "User not created" });
        }
    }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    if(user){
      res.json({
       _id: user._id,
       email: user.email,
       fullname: user.fullname,
       country: user.country,
       avatar: user.avatar,
      });
    } else {
      res.status(401)
      throw new Error('User not found') 
    }
  })
  

// @desc Update user details
// @route   PUT /users/profile
// @access  Private

const updateUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.email = req.body.email || user.email;
        user.fullname = req.body.fullname || user.name;
        user.country = req.body.country || user.country;
        user.avatar = req.body.avatar || user.avatar;
        if(req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            email: updatedUser.email,
            fullname: updatedUser.fullname,
            country: updatedUser.country,
            avatar: updatedUser.avatar,
            message: "User updated",
        });
        
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// @desc Send an email to reset password
// @route   POST /users/reset
// @access  Public

const mailForPasswordReset = asyncHandler(async(req, res) => {
    try{
        const {email} = req.body;
        
        const user = await User.findOne({email});

        if(!user) {
            res.status.status(404).json({message: "Email not found."});
        }

        // Send the reset link
        if(user) {
            await sendEmail(user._id,email, 'forgot password');

            res.status(200).json({
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                country: user.country,
                avatar: user.avatar,
                message: "Reset link sent",});
        }

    } catch(err) {
        res.status(401);
        throw new Error("Could not send email. Please retry.");
    }

});


// @desc Reset user password
// @route   PUT /users/reset
// @access  Public

const resetPassword = asyncHandler(async(req, res) => {
        try{
            const {password} = req.body;
            
            const {passwordToken} = req.body;

            const decodedToken = jwt.verify(passwordToken, process.env.JWT_FORGOT_PASSWORD);

            const user = await User.findById(decodedToken._id);

            if(user && password) {
                
                user.password = password;
                
                const updatedUser = await user.save();

                if(updatedUser) {
                    res.status(200).json({
                        _id: updatedUser._id,
                        email: updatedUser.email,
                        fullname: updatedUser.fullname,
                        country: updatedUser.country,
                        avatar: updatedUser.avatar,
                        message: "Password reset",
                    });
                } else {
                    res.status(401);
                    throw new Error("Unable to update the password. Please retry.");
                }   
            }
        } catch(err) {
            res.status(400).json({message: "Reset link has expired. Please request a new one."});
        } 
    }
    )


    // @desc Logout user
    // @route   POST /users/logout
    // @access  Private

    const logoutUser = asyncHandler(async(req, res) => {
        try{
            const {email} = req.body;
            
            const user = await User.findOne({email});

            if(user) {
                user.tokens = [];
                await user.save();
                res.status(200).json({message: "User logged out."});
            } else {
                res.status(401);
                throw new Error("User not found.");
            }
        } catch(err) {
            res.status(401);
            throw new Error("Could not log out. Please retry.");
        }
    });
    

    // @desc Delete user
    // @route   DELETE /users/:id
    // @access  Private

    const deleteUser = asyncHandler(async (req, res) => {
      
        try {
                await User.findByIdAndDelete(req.user._id);
                res.status(200).json({message: "User deleted."});
        } catch (error) {
            res.status(404);
            throw new Error("User not found.");
        }
    })


    // @desc Get all users with a search query
    // @route   GET /users/search
    // @access  Private

    const searchUsers = asyncHandler(async (req, res) => {
        try {
            const {searchQuery} = req.body;
            const users = await User.find({fullname: {$regex: searchQuery, $options: "i"}});
            res.status(200).json(users);
        } catch (error) {
            res.status(404);
            throw new Error("Users not found.");
        }
    })



export { authUser, registerUser, updateUser, mailForPasswordReset, resetPassword, getUserProfile,logoutUser,deleteUser,searchUsers};