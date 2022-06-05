import User from "../models/userModel.js";

export default function authenticationManager(req, res, nextFunction) {
    if (req.user.role != "manager") {
        return res.status(400).json({ message: "You are not manager." });
    }
    nextFunction();
}