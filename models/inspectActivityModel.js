import mongoose from "mongoose";
const { Schema, model } = mongoose;

const inspectActivitySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    facilityID: {
        type: String,
        required: true
    },
    expertID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    timeFrom: {
        type: String,
        required: true
    },
    timeTo: {
        type: String,
        required: true
    },
    samples: {
        type: Array,
        default: []
    },
    // Cập nhật giai đoạn của đợt thanh tra:
    // -1: Đã đến ngày thanh tra nhưng chuyên viên chưa tiến hành.
    // 0: Chưa tới ngày thanh tra.
    // 1: Giai đoạn khảo sát tại cơ sở.
    // 2: Giai đoạn xét nghiệm mẫu thức ăn (nếu cần).
    // 3: Giai đoạn tổng hợp kết quả.
    // 4: Giai đoạn xử lý vi phạm (nếu cơ sở vi phạm).
    state: {
        type: Number,
        default: 0
    },
    // Kết quả của lần thanh tra:
    // -1 tương ứng với chưa có kết quả
    // 0 tương ứng với cơ sở không đạt tiêu chuẩn an toàn thực phẩm.
    // 1 tương ứng với cơ sở đạt tiêu chuẩn an toàn thực phẩm.
    result: {
        type: Number,
        default: -1
    },
    minutes: {
        type: Object,
        default: {
            level: "",
            penalty: "",
            description: ""
        }
    }
})

export default model("InspectActivity", inspectActivitySchema);