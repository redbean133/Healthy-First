import mongoose from "mongoose";
const { Schema, model } = mongoose;

const inspectionUnitSchema = new Schema({
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
    }
})

export default model("InspectionUnit", inspectionUnitSchema);