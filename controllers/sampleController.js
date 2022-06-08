import Sample from "../models/sampleModel.js";
import InspectionUnit from "../models/inspectionUnitModel.js";
import { checkPermission } from "./facilityController.js";
import { filterByExpertArea } from "../utils/filter.js";

// Thêm mẫu thực phẩm mới.
export async function addNewSample(req, res) {
    const { _id, name, inspectionUnitID, facilityID, state } = req.body;
    const inspectionResult = req.body.inspectionResult || -1;
    const receiveResultOn = req.body.receiveResultOn || "";

    // Kiểm tra quyền hạn của user
    const canDo = await checkPermission(req.user, facilityID);
    if (!canDo) {
        return res.status(403).json({ message: `Không có quyền hạn với cơ sở ${ facilityID }.` });
    }

    // Kiểm tra _id đã tồn tại hay chưa.
    const checkID = await Sample.findById(_id);
    if (checkID) {
        return res.status(400).json({ message: "ID đã tồn tại." });
    }

    // Kiểm tra inspectionUnitID có hợp lệ không.
    const checkInspectionUnit = await InspectionUnit.findById(inspectionUnitID);
    if (!checkInspectionUnit) {
        return res.status(400).json({ message: "Đơn vị giám định không tồn tại." });
    }

    // Tạo một mẫu thực phẩm mới và lưu vào cơ sở dữ liệu.
    const newSample = new Sample({
        _id,
        name,
        inspectionUnitID,
        facilityID,
        state,
        inspectionResult,
        receiveResultOn
    });

    newSample.save()
    .then((newSample) => {
        res.status(200).json({
            message: "Đã tạo một mẫu thực phẩm mới.",
            newSample: newSample
        });
    })
    .catch((error) => {
        res.status(500).json({
            message: "Lỗi hệ thống.",
            error: error.message
        })
    })
}

export async function getList(req, res) {
    const user = req.user;
    const perPage = 30;
    let page = req.query.page || 1;
    let query = Sample.find({});
    query.skip((page - 1) * perPage)
        .limit(perPage)
        .exec()
        .then(async (samples) => {
            let result = await filterByExpertArea(user, samples);
            return res.status(200).json({
                message: `Truy xuất thành công ${ result.length } đối tượng.`,
                samples: result
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: "Hệ thống gặp sự cố.",
                error: error.message
            })
        })
}

// Chỉnh sửa (cập nhật trạng thái và kết quả).
export async function changeInformation(req, res) {
    const { name, inspectionUnitID, facilityID, state } = req.body;
    const _id = req.params.id;
    const inspectionResult = req.body.inspectionResult || -1;
    const receiveResultOn = req.body.receiveResultOn || "";

    // Kiểm tra quyền hạn của user
    const canDo = await checkPermission(req.user, facilityID);
    if (!canDo) {
        return res.status(403).json({ message: `Không có quyền hạn với cơ sở ${ facilityID }.` });
    }

    // Kiểm tra inspectionUnitID có hợp lệ không.
    const checkInspectionUnit = await InspectionUnit.findById(inspectionUnitID);
    if (!checkInspectionUnit) {
        return res.status(400).json({ message: "Đơn vị giám định không tồn tại." });
    }

    // Chỉnh sửa thông tin.
    Sample.updateOne({ _id: _id }, {
        name,
        inspectionUnitID,
        facilityID,
        state,
        inspectionResult,
        receiveResultOn
    })
    .exec()
    .then(() => {
        return res.status(200).json({ message: "Chỉnh sửa thông tin thành công." });
    })
    .catch((error) => {
        return res.status(500).json({ message: error.message });
    });
}

// Lấy thông tin chi tiết.
export async function getDetailInformation(req, res) {
    const _id = req.params.id;
    const canDo = await checkUserPermission(req.user, _id);
    if (!canDo) {
        return res.status(403).json({ message: "Không có quyền hạn." });
    }
    Sample.findById(_id)
    .exec()
    .then((sample) => {
        return res.status(200).json({
            message: "Lấy thông tin thành công",
            sample: sample
        })
    })
    .catch((error) => {
        return res.status(500).json({ 
            message: "Hệ thống gặp sự cố.",
            error: error.message
        });
    })
}

// Xóa mẫu thực phẩm.
export async function deleteSample(req, res) {
    const _id = req.params.id;
    const canDo = await checkUserPermission(req.user, _id);
    if (!canDo) {
        return res.status(403).json({ message: "Không có quyền hạn." });
    }
    Sample.deleteOne({ _id: _id })
    .exec()
    .then((result) => {
        return res.status(200).json({
            message: "Xoá mẫu thực phẩm thành công",
            result: result
        })
    })
    .catch((error) => {
        return res.status(500).json({ 
            message: "Hệ thống gặp sự cố.",
            error: error.message
        });
    })
}

// Đầu vào là người dùng và ID của mẫu thực phẩm.
// Kiểm tra xem người dùng có quyền thao tác với mẫu thực phẩm hay không.
async function checkUserPermission(user, sampleID) {
    const sample = await Sample.findById(sampleID);
    const check = await checkPermission(user, sample.facilityID);
    return check;
}