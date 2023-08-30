import Follow from "../models/followUser";

// @desc    Follow a user
// @route   POST /users/follow
// @access  Private
const followUser = async (req, res) => {
    try {
            const { followerID, followingID } = req.body;

            // Check if the user has already followed the user
            const existingFollow = await Follow.findOne({ followerID, followingID });
             
            if (existingFollow) {
                await existingFollow.remove();
                res.status(200).json({ message: "User unfollowed" });
            } else {
                const newFollow = new Follow({
                    followerID,
                    followingID,
                });
                await newFollow.save();
                res.status(201).json({ message: "User followed" });
            }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        }
    }

    export default followUser;