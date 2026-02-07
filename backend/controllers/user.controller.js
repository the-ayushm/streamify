import User from "../models/user.model.js";

export const getSidebarUsers = async (req, res) => {
    try {
        const loggedinUserId = req.user._id;
        const sidebarUsers = await User.find({
            _id: { $ne: loggedinUserId }
        }).select("-password");

        res.status(200).json(sidebarUsers);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users!" })
    }
}