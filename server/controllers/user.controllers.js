import User from "../models/user.model.js"

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        if (!user) {
            res.status(401).json({ success: false, message: "User Not Found" })
        }

        res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error);
    }
}