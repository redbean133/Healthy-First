import mongoose from "mongoose";
const { Schema, model } = mongoose;

const sampleSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    inspectionUnitID: {
        type: String,
        required: true
    },
    facilityID: {
        type: String,
        required: true
    },
    // 0: Chưa gửi mẫu tới cơ sở giám định.
    // 1: Đã gửi mẫu tới cơ sở giám định.
    // 2: Đã nhận được kết quả giám định.
    state: {
        type: Number,
        required: true
    },
    // 0: Không đạt tiêu chuẩn an toàn thực phẩm.
    // 1: Đạt tiêu chuẩn an toàn thực phẩm.
    // -1: Chưa có kết quả.
    inspectionResult: {
        type: Number,
        default: -1
    },
    receiveResultOn: {
        type: String
    }
});

export default model("Sample", sampleSchema);