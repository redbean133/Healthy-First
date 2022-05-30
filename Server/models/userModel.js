import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    identityCardNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "expert"
    },
    areas: {
        type: Array,
        default: []
    }
});

export default model("User", userSchema);