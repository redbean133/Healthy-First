import InspectionUnit from "../models/inspectionUnitModel.js";

// Cho phép tìm kiếm theo tên đơn vị xét nghiệm.
// Phân trang - mỗi trang hiển thị tối đa 30 đơn vị.
export async function getInspectionUnitList(req, res) {
    const perPage = 30;
    let page = req.query.page || 1;
    const name = new RegExp(req.query.name, "gi")
    const query = InspectionUnit.find({ name: name });
    query.skip((page - 1) * perPage)
        .limit(perPage)
        .exec()
        .then((result) => {
            res.status(200).json({
                message: `Truy vấn thành công ${ result. length } đối tượng.`,
                inspectionUnits: result
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: "Hệ thống gặp sự cố.",
                error: error.message
            })
        })
}

export async function addNewInspectionUnit(req, res) {
    const { _id, name, address } = req.body;
    
    // Kiểm tra xem các trường dữ liệu đã được nhập đầy đủ.
    if (!(_id && name && address)) {
        return res.status(400).json({
            message: "Please enter enough information."
        });
    }

    const checkInspectionUnitId = await InspectionUnit.findById(_id);
    if (checkInspectionUnitId) {
        return res.status(400).json({
            message: "This inspection unit ID is exist in database."
        })
    }

    // Tạo đơn vị kiểm nghiệm mới và lưu vào cơ sở dữ liệu.
    const newInspectionUnit = new InspectionUnit(req.body);
    newInspectionUnit.save()
    .then((inspectionUnit) => {
        return res.status(200).json({
            message: "Add new Inspection Unit successfully.",
            inspectionUnit: inspectionUnit
        })
    })
    .catch((error) => {
        return res.status(500).json({
            message: "Server error. Please try again.",
            error: error.message
        })
    });
}

// Chỉnh sửa đơn vị xét nghiệm thực phẩm.
export async function changeInformation(req, res) {
    const { name, address } = req.body;
    const _id = req.params.id;
    if (!(name && address)) {
        return res.status(400).json({ message: "Không được để trống thông tin." });
    }
    InspectionUnit.updateOne({ _id: _id }, { name: name, address: address })
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
}

// Lấy thông tin của một đơn vị xét nghiệm.
export async function getInformation(req, res) {
    const _id = req.params.id;
    InspectionUnit.findById(_id)
    .then((inspectionUnit) => {
        if (inspectionUnit) {
            return res.status(200).json({
                message: "Lấy thông tin thành công",
                inspectionUnit: inspectionUnit
            })
        } else {
            return res.status(400).json({
                message: "Đơn vị không tồn tại trong cơ sở dữ liệu"
            })
        }
    })
    .catch((error) => {
        return res.status(500).json({
            message: "Hệ thống gặp sự cố",
            error: error.message
        })
    })
}