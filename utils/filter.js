import Facility from "../models/facilityModel.js";

// Hàm có chức năng filter một mảng các đối tượng dựa trên quyền hạn (khu vực quản lý) của người dùng.
// Các đối tượng này có thể là Certificate hoặc InspectActivity (các đối tượng có một trường thuộc tính facilityID)
export async function filterByExpertArea(user, array) {
    if (user.role == "manager") {
        return array;
    } else {
        let result = [];
        for (let i = 0; i < array.length; i++) {
            let object = array[i];
            if (object.facilityID) {
                let facilityID = object.facilityID;
                let facility = await Facility.findById(facilityID);
                if (user.areas.includes(facility.address.district)) {
                    result.push(object);
                }
            }   
        }
        return result;
    }
}