import mongoose from "mongoose";
const { Schema, model } = mongoose;

const certificateSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    createOn: {
        type: String,
        required: true
    },
    expireOn: {
        type: String,
        required: true
    },
    facilityID: {
        type: String,
        required: true
    },
    expertID: {
        type: String,
        required: true
    },
    // Trạng thái: "valid" hoặc "expired" hoặc "revoked"
    state: {
        type: String,
        required: true
    }
})

export default model("Certificate", certificateSchema);