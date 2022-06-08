import InspectActivity from "../models/inspectActivityModel.js";
import mongoose from "mongoose";
import moment from "moment";
import { getToday } from "../utils/dateFeatures.js";
import { filterByExpertArea } from "../utils/filter.js";
import { checkPermission } from "./facilityController.js";

// Tạo một đợt thanh tra mới.
export async function addNewInspectActivity(req, res) {
    const expertID = req.user._id;
    const { facilityID, timeFrom, timeTo } = req.body;

    const check = await checkPermission(req.user, facilityID);
    if (!check) {
        return res.status(403).json({ message: "You are not allowed." });
    }

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

// Lấy danh sách hoạt động thanh tra. Ưu tiên hiển thị đợt thanh tra trong tương lai gần.
// Chỉ lấy hoạt động thanh tra thuộc khu vực quản lý của chuyên viên.
// Chia hoạt động thanh tra thành bốn loại:
// 1. Đã quá hạn mà chưa được tiến hành (state = -1)
// 2. Đang được tiến hành (state = 1 (đang thanh tra) || 2 (đang đợi xét nghiệm sample))
// 3. Sắp đến ngày bắt đầu (state = 0)
// 4. Đã hoàn thành (state = 3 (đã kết luận) || 4 (có xử lý vi phạm))
export async function getListInspectActivity(req, res) {
    let activities = await InspectActivity.find({});
    console.log(activities)
    activities = await filterByExpertArea(req.user, activities);
    console.log(activities)
    const finished = []; // List activity đã hoàn thành.
    const doing = []; // List activity đang thực hiện.
    const coming = []; // List activity sắp tới.
    const expired = []; // List activity đã quá ngày bắt đầu mà chưa được tiến hành.
    for (let i = 0; i < activities.length; i++) {
        let activity = activities[i];
        let startDate = moment(activity.timeFrom);
        let today = moment(getToday());
        if (startDate.isBefore(today) && activity.state == 0) {
            activity.state = -1;
            await activity.save();
        }
        switch (activity.state) {
            case -1:
                expired.push(activity);
                break;
            case 0:
                coming.push(activity);
                break;
            case 1:
            case 2:
                doing.push(activity);
                break;
            case 3:
            case 4:
                finished.push(activity);
        }
    }
    // Sắp xếp coming activity dựa trên độ ưu tiên. Những activity gần hơn thì được xếp trước.
    for (let i = 0; i < coming.length - 1; i++) {
        let date1 = moment(coming[i].timeFrom);
        for (let j = i + 1; j < coming.length; j++) {
            let date2 = moment(coming[j].timeFrom);
            if (date2.isBefore(date1)) {
                let temp = coming[i];
                coming[i] = coming[j];
                coming[j] = temp;
            }
        }
    }

    res.status(200).json({
        message: "Truy vấn thành công.",
        expiredActivity: expired,
        doingActivity: doing,
        comingActivity: coming,
        finishedActivity: finished
    })
}

export async function getDetailInformation(req, res) {
    const _id = req.params.id;
    InspectActivity.findById(_id)
    .exec()
    .then((inspectActivity) => {
        return res.status(200).json({
            message: "Truy cập thông tin thành công.",
            inspectActivity: inspectActivity
        })
    })
    .catch((error) => {
        return res.status(500).json({
            message: "Hệ thống gặp sự cố.",
            error: error.message
        })
    });
}

// Giám sát hoạt động: Cho phép chuyên viên cập nhật trạng thái của đợt thanh tra.
// URL: http://localhost:5000/inspect-activity/id
// Set có thể là state | samples | result | minutes.
export async function updateActivity(req, res) {
    const _id = req.params.id;
    const activity = await InspectActivity.findById(_id);
    const canUpdate = await checkPermission(req.user, activity.facilityID);
    if (!canUpdate) {
        return res.status(403).json({ message: "Không có quyền hạn." });
    }
    InspectActivity.updateOne({ _id: _id }, { ...req.body })
    .exec()
    .then(() => {
        return res.status(200).json({ message: "Cập nhật thành công." });
    })
    .catch((error) => {
        return res.status(500).json({ message: error.message });
    });
}

// Thống kê kết quả thực hiện thanh kiểm tra.
// Phía client sẽ gửi lên thời gian: timeFrom - timeTo (2022-03 2022-04).
// Kết quả trả về gồm ba mảng months (tháng), achived (số lượng đạt ATTP), nonAchived (số lượng không đạt)
export async function makeStatistical(req, res) {
    const { timeFrom, timeTo } = req.body;
    const user = req.user;

    // Lấy danh sách thanh kiểm tra tương ứng với quyền hạn quản lý của user.
    let activities;
    await InspectActivity.find({})
    .then(async (result) => {
        activities = await filterByExpertArea(user, result);
    })
    .catch((error) => {
        return res.status(500).json({
            message: "Hệ thống gặp sự cố.",
            error: error.message
        })
    })
    
    // Lấy toàn bộ tháng giữa timeFrom và timeTo
    let months = [];
    let startMonth = moment(timeFrom);
    let endMonth = moment(timeTo)
    if (endMonth.isBefore(startMonth)) {
        return res.status(400).json({ message: "Thời gian không hợp lệ." })
    }
    while (startMonth.isBefore(endMonth)) {
        months.push(startMonth.format("YYYY-MM"));
        startMonth.add(1, "month");
    }
    months.push(startMonth.format("YYYY-MM"));
    
    // Đếm số lượng kết quả thanh tra kết luận trong các tháng tương ứng.
    let achived = [];
    let nonAchived = [];

    for (let i = 0; i < months.length; i++) {
        achived.push(0);
        nonAchived.push(0);
    }

    for (let i = 0; i < activities.length; i++) {
        let activity = activities[i];
        let finishedMonth = moment(activity.timeTo).format("YYYY-MM");
        let index = months.indexOf(finishedMonth);
        if (index >= 0) {
            if (activity.result == 0) {
                nonAchived[index]++;
            } else if (activity.result == 1) {
                achived[index]++;
            }
        }
    }
    res.status(200).json({
        months: months,
        achived: achived,
        nonAchived: nonAchived
    })
}

export async function deleteActivity(req, res) {
    const _id = req.params.id;
    const activity = await InspectActivity.findById(_id);
    const canUpdate = await checkPermission(req.user, activity.facilityID);
    if (!canUpdate) {
        return res.status(403).json({ message: "Không có quyền hạn." });
    }
    InspectActivity.deleteOne({ _id: _id })
    .exec()
    .then(() => {
        return res.status(200).json({ message: "Xoá thành công." });
    })
    .catch((error) => {
        return res.status(500).json({ message: error.message });
    });
}