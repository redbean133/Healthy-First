import Facility from "../models/facilityModel.js";
import Certificate from "../models/certificateModel.js";
import { paginating } from "../utils/paginating.js";
import { getToday } from "../utils/dateFeatures.js";
import moment from "moment";

export async function addNewFacility(req, res) {
    const { _id, name, address, owner, email, phoneNumber,
        typeOfBusiness, certificateID } = req.body;
    
    // Kiểm tra xem các trường dữ liệu đã được nhập đầy đủ.
    if (!(_id && name && address && owner && email && phoneNumber && typeOfBusiness)) {
        return res.status(400).json({
            message: "Please enter enough information."
        });
    }

    const checkFacilityId = await Facility.findById(_id);
    if (checkFacilityId) {
        return res.status(400).json({
            message: "This facility ID is exist in database."
        })
    }

    // Kiểm tra User hiện tại có quyền thêm cơ sở mới hay không.
    if (!(req.user.role == "manager" || req.user.areas.includes(address.district))) {
        return res.status(403).json({
            message: "You are not allowed."
        });
    }

    // Nếu nhập mã giấy chứng nhận ATTP, kiểm tra xem mã có tồn tại trong database hay không.

    // Tạo cơ sở mới và lưu trữ trong cơ sở dữ liệu.
    const newFacility = new Facility(req.body);
    newFacility.save()
    .then((facility) => {
        return res.status(200).json({
            message: "Add new facility successfully.",
            facility: facility
        })
    })
    .catch((error) => {
        return res.status(500).json({
            message: "Server error. Please try again.",
            error: error.message
        })
    });
}

// Lấy toàn bộ cơ sở [có phân trang] theo khu vực quản lý của user.
// Tra cứu thông tin của cơ sở theo tên, filter theo địa chỉ.
// URL: http://localhost:5000/facility?page=1&name=Cơ+sở&city=Hà+Nội&district=Mê+Linh
export async function getFacilityList(req, res) {
    const user = req.user;
    const perPage = 1;
    let query;
    let page = req.query.page || 1;
    if (req.query.name) {
        const name = new RegExp(req.query.name, "gi");
        query = Facility.find({ name: name });
    } else {
        query = Facility.find({});
    }
    query.exec()
        .then((result) => {
            let facilities = [];
            if (req.query.subDistrict) {
                for (let i = 0; i < result.length; i++) {
                    let facility = result[i];
                    if (facility.address.subDistrict == req.query.subDistrict) {
                        facilities.push(facility);
                    }
                }
            } else if (req.query.district) {
                for (let i = 0; i < result.length; i++) {
                    let facility = result[i];
                    if (facility.address.district == req.query.district) {
                        facilities.push(facility);
                    }
                }
            } else if (req.query.city) {
                for (let i = 0; i < result.length; i++) {
                    let facility = result[i];
                    if (facility.address.city == req.query.city) {
                        facilities.push(facility);
                    }
                }
            }
            return facilities;
        })
        .then((result) => {
            let facilities = filterFacilityByUserAreas(user, result);
            let returnResult = paginating(page, perPage, facilities);
            return res.status(200).json({
                message: `Truy vấn thành công ${ returnResult.length } đối tượng.`,
                facilities: returnResult
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: "Lỗi hệ thống.",
                error: error.message
            })
        })
}

// Filter các cơ sở đạt an toàn thực phẩm (giấy chứng nhận còn hiệu lực).
// Filter các cơ sở không đạt an toàn thực phẩm.
// Có thể Filter chi tiết hơn: chưa được cấp chứng nhận/ đã hết hạn/ bị thu hồi.
// URL: http://localhost:5000/facility/filter-by-certificate
export async function filterByCertificateState(req, res) {
    const user = req.user;
    let facilities = await Facility.find({});
    let today = moment(getToday());
    facilities = filterFacilityByUserAreas(user, facilities);
    let valid = [];
    let invalid = [];
    let notHave = [];
    let expired = [];
    let revoked = [];
    for (let i = 0; i < facilities.length; i++) {
        let facility = facilities[i];
        if (!facility.certificateID) {
            invalid.push(facility);
            notHave.push(facility);
        } else {
            const certificate = await Certificate.findById(facility.certificateID);
            if (certificate.state == "revoked") {
                invalid.push(facility);
                revoked.push(facility);
            } else {
                let expireDate = moment(certificate.expireOn);
                if (expireDate.isBefore(today)) {
                    certificate.state = "expired";
                    await certificate.save();
                    invalid.push(facility);
                    expired.push(facility);
                } else {
                    valid.push(facility);
                }
            }
        }
    }
    res.status(400).json({
        valid: valid,
        invalid: invalid,
        notHave: notHave,
        expired: expired,
        revoked: revoked
    })
}

// Function lấy các cơ sở dựa trên khu vực quản lý của người dùng.
function filterFacilityByUserAreas(user, originFacility) {
    if (user.role == "manager") {
        return originFacility;
    } else {
        let facilities = [];
        for (let i = 0; i < originFacility.length; i++) {
            let facility = originFacility[i];
            if (user.areas.includes(facility.address.district)) {
                facilities.push(facility);
            }
        }
        return facilities;
    }
}


// Sửa thông tin cơ sở [Nếu sửa id thì phải sửa cả id trong collection khác.]
// Xóa cơ sở [chỉ xóa khi không tìm thấy cơ sở này trong các collection khác.]

// Xem toàn bộ biên bản vi phạm của cơ sở.