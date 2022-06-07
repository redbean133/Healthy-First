import Facility from "../models/facilityModel.js";
import Certificate from "../models/certificateModel.js";
import InspectActivity from "../models/inspectActivityModel.js";
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

export async function getDetailInformation(req, res) {
    const _id = req.params.id;
    Facility.findById(_id)
    .exec()
    .then((facility) => {
        return res.status(200).json({
            message: "Truy cập thông tin thành công.",
            facility: facility
        })
    })
    .catch((error) => {
        return res.status(500).json({
            message: "Hệ thống gặp sự cố.",
            error: error.message
        })
    });
}

// Lấy toàn bộ cơ sở [có phân trang] theo khu vực quản lý của user.
// Tra cứu thông tin của cơ sở theo tên, filter theo địa chỉ.
// URL: http://localhost:5000/facility?page=1&name=Cơ+sở&city=Hà+Nội&district=Mê+Linh&subDistrict=Tam+Đồng
export async function getFacilityList(req, res) {
    const user = req.user;
    const perPage = 30;
    let query;
    let page = req.query.page || 1;
    // Lọc theo tên
    if (req.query.name) {
        const name = new RegExp(req.query.name, "gi");
        query = Facility.find({ name: name });
    } else {
        query = Facility.find({});
    }
    query.exec()
        .then((result) => {
            let facilities = [];
            // Lọc theo khu vực, từ thành phố, tới huyện rồi đến xã.
            if (req.query.city) {
                for (let i = 0; i < result.length; i++) {
                    let facility = result[i];
                    if (facility.address.city == req.query.city) {
                        facilities.push(facility);
                    }
                }
                if (req.query.district) {
                    for (let i = facilities.length - 1; i >= 0; i--) {
                        let facility = facilities[i];
                        if (facility.address.district != req.query.district) {
                            facilities.splice(i, 1);
                        }
                    }
                    if (req.query.subDistrict) {
                        for (let i = facilities.length - 1; i >= 0; i--) {
                            let facility = facilities[i];
                            if (facility.address.subDistrict != req.query.subDistrict) {
                                facilities.splice(i, 1);
                            }
                        }
                    }
                }
            } else {
                facilities = result;
            }
            return facilities;
        })
        .then((result) => {
            let facilities = result;
            if (user) {
                facilities = filterFacilityByUserAreas(user, result);
            }
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
        });
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
    res.status(200).json({
        valid: valid,
        invalid: invalid,
        notHave: notHave,
        expired: expired,
        revoked: revoked
    })
}

// Function lọc các cơ sở tương ứng với khu vực quản lý của chuyên viên.
export function filterFacilityByUserAreas(user, originFacility) {
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


// Sửa thông tin cơ sở.
export async function changeInformation(req, res) {
    const { name, address, owner, email, phoneNumber, typeOfBusiness, certificate } = req.body;
    const _id = req.params.id;
    if (!(name && address && owner && email && phoneNumber && typeOfBusiness)) {
        return res.status(400).json({ message: "Không được để trống thông tin." });
    }

    // Kiểm tra User hiện tại có quyền chỉnh sửa thông tin cơ sở này hay không.
    // Nếu User có quyền thì cập nhật thông tin vào cơ sở dữ liệu.
    if (checkPermission(req.user, _id)) {
        Facility.updateOne({ _id: _id }, { name, address, owner, email, phoneNumber, typeOfBusiness, certificate })
        .then((result) => {
            return res.status(200).json({
                message: "Chỉnh sửa thành công.",
                information: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: "Hệ thống gặp sự cố.",
                error: error.message
            })
        })
    } else {
        return res.status(403).json({
            message: "You are not allowed."
        });
    }
}

// Xóa cơ sở [chỉ xóa khi không tìm thấy cơ sở này trong các collection khác.]
export async function deleteFacility(req, res) {
    const _id = req.params.id;
    if (checkPermission(req.user, _id)) {
        const checkInCertificateCollection = await Certificate.findOne({ facilityID: _id });
        const checkInInspectCollection = await InspectActivity.findOne({ facilityID: _id });
        if (!checkInCertificateCollection && !checkInInspectCollection) {
            await Facility.deleteOne({ _id: _id })
            return res.status(200).json({
                message: "Xóa cơ sở thành công."
            });
        } else {
            return res.status(400).json({
                message: "Không thể xóa cơ sở do có liên quan tới các thông tin khác."
            });
        }
    } else {
        return res.status(403).json({
            message: "You are not allowed."
        });
    }
}

// Hàm này dùng để check quyền hạn của User hiện tại đối với một cơ sở nào đó.
// Trả về True tương ứng với có quyền hạn, False tương ứng với không có quyền hạn.
export async function checkPermission(user, facilityID) {
    const facility = await Facility.findById(facilityID);
    if (facility) {
        if (!(user.role == "manager" || user.areas.includes(facility.address.district))) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}