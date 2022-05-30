import InspectActivity from "../models/inspectActivityModel.js";
import mongoose from "mongoose";

// Tạo một đợt thanh tra mới.
export async function addNewInspectActivity(req, res) {
    const expertID = req.user._id;
    const { facilityID, timeFrom, timeTo } = req.body;

    console.log(expertID);
    // Kiểm tra ngày tháng.
    const today = new Date();
    const timeFromDate = new Date(timeFrom);
    const timeToDate = new Date(timeTo);
    if (timeFromDate < today || timeToDate < today || timeFromDate > timeToDate) {
        return res.status(400).json({ message: "Thời gian thanh tra không hợp lệ." });
    }

    // Tạo đợt thanh tra mới và lưu vào cơ sở dữ liệu.
    const newInspectActivity = new InspectActivity({
        _id: mongoose.Types.ObjectId(),
        facilityID: facilityID,
        expertID: expertID,
        timeFrom: timeFrom,
        timeTo: timeTo
    });

    newInspectActivity.save()
    .then((newInspectActivity) => {
        res.status(200).json({
            message: "Đã tạo đợt thanh tra mới.",
            inspectActivity: newInspectActivity
        });
    })
    .catch((error) => {
        res.status(500).json({
            message: "Lỗi hệ thống.",
            error: error.message
        })
    })
}

// Hiển thị list hoạt động thanh tra. Ưu tiên hiển thị đợt thanh tra trong tương lai gần.

// Giám sát hoạt động: Cho phép chuyên viên cập nhật trạng thái liên tục.

// Thống kê kết quả thực hiện thanh kiểm tra.

// Tự động gợi ý những cơ sở cần thanh, kiểm tra tiếp theo.

// Filter hoạt động theo trạng thái. Cho phép tìm kiếm theo tên cơ sở.
