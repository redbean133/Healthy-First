import Certificate from "../models/certificateModel.js";
import Facility from "../models/facilityModel.js";
import { getToday } from "../utils/dateFeatures.js";
import { filterByExpertArea } from "../utils/filter.js";
import { filterFacilityByUserAreas } from "./facilityController.js";
import { checkPermission } from "./facilityController.js";
import moment from "moment";

// Cấp mới giấy chứng nhận.
export async function addCertificate(req, res) {
    let { _id, createOn, expireOn, facilityID, state } = req.body;
    const expertID = req.user._id;

    const today = new Date();
    const expireOnDate = new Date(expireOn);
    const createOnDate = new Date(createOn);
    if (expireOnDate < createOnDate) {
        return res.status(400).json({ message: "Ngày hết hạn không được nhỏ hơn ngày cấp." });
    }

    const checkExist = await Certificate.findOne({ _id: _id });
    if (checkExist) {
        return res.status(400).json({ message: "Mã số giấy chứng nhận đã được sử dụng" });
    }

    if (!state) {
        if (today > expireOnDate) {
            state = "expire";
        } else {
            state = "valid";
        }
    }

    const canAdd = await checkPermission(req.user, facilityID);
    if (!canAdd) {
        return res.status(400).json({
            message: "Không có quyền hạn cấp giấy chứng nhận cho cơ sở này.",
        });
    }

    const newCertificate = new Certificate({ _id, createOn, expireOn, facilityID, expertID, state });
    newCertificate.save()
    .then(async (newCertificate) => {
        await Facility.updateOne({ _id: facilityID }, { certificateID: _id });
        res.status(200).json({
            message: "Thêm bản chứng nhận thành công.",
            certificate: newCertificate
        });
    })
    .catch((error) => {
        res.status(500).json({
            message: "Lỗi hệ thống.",
            error: error.message
        })
    })
}

// Gia hạn giấy chứng nhận.
export async function extend(req, res) {
    const _id = req.params.id;
    const newExpire = req.body.expireOn;
    const certificate = await Certificate.findById(_id);
    const today = new Date();
    const newExpireDate = new Date(newExpire);
    const originExpireDate = new Date(certificate.expireOn)
    if (newExpireDate < today || newExpireDate < originExpireDate) {
        return res.status(400).json({
            message: "Ngày gia hạn phải lớn hơn ngày hiện tại và ngày hết hạn vốn có."
        });
    }

    Certificate.updateOne({ _id: _id }, { expireOn: newExpire, state: "valid" }).exec()
    .then(() => {
        res.status(200).json({ message: "Gia hạn thành công." });
    })
    .catch((error) => {
        res.status(500).json({
            message: "Lỗi hệ thống",
            error: error.message
        })
    })
}

// Thu hồi giấy chứng nhận.
export async function revoke(req, res) {
    const _id = req.params.id;
    Certificate.updateOne({ _id: _id }, { expireOn: getToday(), state: "revoked" }).exec()
    .then((result) => {
        if (result.modifiedCount == 0) {
            return res.status(400).json({ message: "Không tìm thấy giấy chứng nhận." });
        }
        res.status(200).json({ message: "Thu hồi thành công." });
    })
    .catch((error) => {
        res.status(500).json({
            message: "Lỗi hệ thống",
            error: error.message
        });
    })
}

export async function getDetail(req, res) {
    const _id = req.params.id;
    Certificate.findById(_id)
    .exec()
    .then((certificate) => {
        return res.status(200).json({
            message: "Truy cập thông tin thành công.",
            certificate: certificate
        })
    })
    .catch((error) => {
        return res.status(500).json({
            message: "Hệ thống gặp sự cố.",
            error: error.message
        })
    });
}

// Lấy danh sách giấy chứng nhận.
// Chỉ lấy danh sách các giấy chứng nhận cấp cho cơ sở thuộc khu vực quản lý của chuyên viên.
// Lấy toàn bộ danh sách giấy chứng nhận nếu người dùng là manager.
// Giấy chứng nhận được sắp xếp giảm dần theo mã số.
export async function getCertificateList(req, res) {
    const user = req.user;
    const perPage = 30;
    let page = req.query.page || 1;
    let query = Certificate.find({});
    query.skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ _id: -1 })
        .exec()
        .then(async (certificates) => {
            let result = await filterByExpertArea(user, certificates);
            return res.status(200).json({
                message: `Truy xuất thành công ${ result.length } đối tượng.`,
                certificates: result
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: "Hệ thống gặp sự cố.",
                error: error.message
            })
        })
}

// Thống kê số lượng giấy chứng nhận cấp theo thời gian/ loại hình cơ sở.
// Phía client sẽ gửi lên thời gian: timeFrom - timeTo (2022-03 2022-04).
// Client lựa chọn loại hình cơ sở cần thống kê, có thể là foodProduction hoặc foodService hoặc cả hai.
// Kết quả trả về gồm hai mảng months và amount.
export async function makeStatistical(req, res) {
    const { timeFrom, timeTo, typeOfBusiness } = req.body;
    const user = req.user;

    // Lấy danh sách cơ sở thuộc loại hình typeOfBusiness.
    let facilityQuery;
    if (typeOfBusiness.length > 1) {
        facilityQuery = Facility.find({});
    } else {
        facilityQuery = Facility.find({ typeOfBusiness: typeOfBusiness });
    }

    // Lấy danh sách _id cơ sở thuộc loại hình typeOfBusiness và thuộc quyền quản lý của user.
    let facilityList = [];
    await facilityQuery.exec()
    .then((facilities) => {
        facilities = filterFacilityByUserAreas(user, facilities);
        for (let i = 0; i < facilities.length; i++) {
            facilityList.push(facilities[i]._id);
        }
    })
    .catch((error) => {
        return res.status(500).json({
            message: "Hệ thống gặp sự cố.",
            error: error.message
        })
    })

    // Lấy danh sách giấy chứng nhận tương ứng với cơ sở thuộc loại hình typeOfBusiness và thuộc quyền quản lý của user.
    let certificates = [];
    await Certificate.find({})
    .then((result) => {
        for (let i = 0; i < result.length; i++) {
            let certificate = result[i];
            if (facilityList.includes(certificate.facilityID)) {
                certificates.push(certificate);
            }
        }
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
    
    // Đếm số lượng chứng chỉ được cấp trong các tháng tương ứng.
    let amount = []
    for (let i = 0; i < months.length; i++) {
        amount.push(0);
    }

    for (let i = 0; i < certificates.length; i++) {
        let certificate = certificates[i];
        let createMonth = moment(certificate.createOn).format("YYYY-MM");
        let index = months.indexOf(createMonth);
        if (index >= 0) {
            amount[index]++;
        }
    }
    res.status(200).json({
        months: months,
        amount: amount
    })
}

// Phần client cần làm sơ đồ thống kê dữ liệu (tham khảo thư viện D3.JS) theo API trên.

// Phần client xuất pdf bản quyết định thu hồi giấy chứng nhận.

// Phần client xuất giấy chứng nhận ra PDF.