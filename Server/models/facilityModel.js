import mongoose from "mongoose";
const { Schema, model } = mongoose;

const facilitySchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    // foodProduction or foodService
    typeOfBusiness: {
        type: Array,
        required: true
    },
    certificateID: {
        type: String,
        default: ""
    }
});

export default model("Facility", facilitySchema);