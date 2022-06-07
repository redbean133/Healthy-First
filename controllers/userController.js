import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/userModel.js";
import Certificate from "../models/certificateModel.js";
import InspectActivity from "../models/inspectActivityModel.js";

export async function registerAccount(req, res) {
    const { name, email, password, retypePassword, phoneNumber, 
        gender, dateOfBirth, identityCardNumber } = req.body;

    // Kiểm tra xem có đầy đủ thông tin cần thiết hay không.
    if (!name || !email || !password || !retypePassword || !phoneNumber
        || !gender || !dateOfBirth || !identityCardNumber) {
        return res.status(400).json({
            message: "Please enter enough information."
        });
    }

    // Kiểm tra xem tài khoản đăng ký đã tồn tại trong database hay chưa.
    // Lần lượt kiểm tra email, số điện thoại và số chứng minh nhân dân.
    const emailIsRegistered = await User.findOne({ email });
    if (emailIsRegistered) {
        return res.status(400).json({
            message: "This email has been registered."
        });
    }

    const phoneNumberIsRegistered = await User.findOne({ phoneNumber });
    if (phoneNumberIsRegistered) {
        return res.status(400).json({
            message: "This phone number has been registered."
        });
    }

    const identityCardIsRegistered = await User.findOne({ identityCardNumber });
    if (identityCardIsRegistered) {
        return res.status(400).json({
            message: "This identity card number has been registered."
        });
    }

    // Kiểm tra xem phần nhập lại mật khẩu có trùng khớp với mật khẩu hay không.
    if (password !== retypePassword) {
        return res.status(400).json({
            message: "Passwords do not match."
        });
    }

    // Kiểm tra xem mật khẩu có hợp lệ hay không. Mật khẩu được coi là hợp lệ khi có độ dài 
    // tối thiểu là 8 kí tự. Bao gồm ít nhất một chữ thường, một chữ hoa và một kí tự số.
    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;
    if (password.length < 8 || !password.match(numbers) || !password.match(lowerCaseLetters)
        || !password.match(upperCaseLetters)) {
        return res.status(400).json({
            message: "Invalid password."
        });
    }

    // Mã hóa mật khẩu.
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Tạo một tài khoản mới
    const newUser = new User({
        _id: mongoose.Types.ObjectId(),
        name: name,
        email: email,
        password: passwordHash,
        phoneNumber: phoneNumber,
        gender: gender,
        dateOfBirth: dateOfBirth,
        identityCardNumber: identityCardNumber
    });

    // Lưu tài khoản vào cơ sở dữ liệu.
    newUser.save().then((newUser) => {
        res.status(201).json({ 
            message: "Register successfully.",
            user: newUser
        });
    }).catch((error) => {
        res.status(500).json({
            message: "Server error. Please try again.",
            error: error.message
        })
    });
}

export async function login(req, res) {
    const { email, password } = req.body;

    // Kiểm tra xem tài khoản có tồn tại hay không.
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "Account is not exist."
        });
    }

    // Nếu tài khoản tồn tại, xác thực mật khẩu.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            message: "Wrong password."
        });
    }

    // Khi mật khẩu chính xác, tạo accessToken và refreshToken
    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });
    if (!accessToken) {
        return res.status(401).json({
            message: "Login fail. Please try again."
        });
    }

    // Lưu refreshToken tại cookie.
    res.cookie("refreshtoken", refreshToken, {
        httpOnly: true, // Đảm bảo cookie không thể truy cập từ client.
        path: "/user/refresh_token" // Cookie chỉ tồn tại ở các path dạng /user/refresh_token/...
    })
    res.json({ 
        message: "Login successfully.",
        accessToken: accessToken,
        user: user
    });
}

export function logout(req, res) {
    res.clearCookie("refreshtoken", { path: "/user/refresh_token"});
    return res.json({ message: "Logout successfully." });
}

// Tạo AccessToken mới khi RefreshToken chưa hết hạn.
export function refreshToken(req, res) {
    const rfToken = req.cookies.refreshtoken;
    if (!rfToken) {
        return res.status(401).json({ message: "You need login first." });
    }
    jsonwebtoken.verify(rfToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) {
            return res.status(401).json({ message: "You need login first." });
        }
        const accessToken = createAccessToken({ id: user.id });
        res.json({ user, accessToken });
    })
}

export async function getInformation(req, res) {
    res.json(req.user);
}

export async function changeInformation(req, res) {
    const { name, email, phoneNumber, gender, dateOfBirth, identityCardNumber } = req.body;

    // Kiểm tra xem có đầy đủ thông tin hay không.
    if (!name || !email || !phoneNumber || !gender || !dateOfBirth || !identityCardNumber) {
        return res.status(400).json({
            message: "Please enter enough information."
        });
    }

    // Kiểm tra xem email, số điện thoại, số CMND mới nhập có trùng với tài khoản khác?
    let check = await User.find({ email });
    if (check.email == email && check._id != req.user._id ) {
        return res.status(400).json({ message: "This email already used for another account." });
    }

    check = await User.find({ phoneNumber });
    if (check.phoneNumber == phoneNumber && check._id != req.user._id ) {
        return res.status(400).json({ message: "This phone number already used for another account." });
    }

    check = await User.find({ identityCardNumber });
    if (check.identityCardNumber == identityCardNumber && check._id != req.user._id ) {
        return res.status(400).json({ message: "This identity card number already used for another account." });
    }

    // Update thông tin tài khoản.
    User.updateOne({ _id: req.user._id }, req.body)
    .exec()
    .then(() => {
        return res.status(200).json({ message: "Update user information successfully." });
    })
    .catch((error) => {
        return res.status(500).json({ message: error.message });
    });
}

function createAccessToken(userID) {
    // AccessToken được tạo với phần payload chứa đối tượng user chứa một trường id có giá trị là userID
    // Hết hạn trong vòng một giờ.
    const accessToken = jsonwebtoken.sign(userID, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "8 hour" });
    return accessToken;
}

function createRefreshToken(userID) {
    const refreshToken = jsonwebtoken.sign(userID, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7 days" });
    return refreshToken;
}

export async function getUserById(userID) {
    const user = await User.findById(userID).select("-password").exec();
    return user;
}

// Cần kiểm tra xem tài khoản có liên quan tới dữ liệu trong collection khác hay không.
// Nếu có liên quan thì không được phép xóa.
export async function deleteAccount(req, res) {
    if (req.user._id == req.params.id || req.user.role == "manager") {
        let existInCertificate = await Certificate.findOne({ expertID: req.params.id });
        let existInInspectActivity = await InspectActivity.findOne({ expertID: req.params.id });
        if (!existInCertificate && !existInInspectActivity) {
            User.deleteOne({ _id: req.params.id }).exec()
            .then((result) => {
                if (result.deletedCount == 0) {
                    return res.status(400).json({ message: "Không tìm thấy tài khoản cần xóa." });
                }
                return res.status(200).json({ message: "Xóa tài khoản thành công" });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: "Hệ thống lỗi.",
                    error: error.message
                });
            })
        } else {
            return res.status(400).json({
                message: "Không thể xóa tài khoản này."
            });
        }
    } else {
        return res.status(403).json({
            message: "Không có quyền hạn để thực hiện hành động này."
        });
    }
}

// Manager set khu vực quản lý cho chuyên viên.
export function setAreas(req, res) {
    if (!req.user.role == "manager") {
        return res.status(403).json({ message: "Không đủ quyền truy cập." });
    }
    const { expertId } = req.params;
    User.updateOne({ _id: expertId }, { areas: req.body.areas }).exec()
    .then((result) => {
        return res.status(200).json({
            message: "Thiết lập khu vực quản lý thành công.",
            result: result
        })
    })
    .catch((error) => {
        return res.status(500).json({ error: error.message });
    })
}


// Manager quản lý tài khoản [phân trang], cho phép tìm kiếm tài khoản theo tên.
// Mỗi page truy vấn tối đa 30 user.
// URL: http://localhost:5000/user/manage?name=cuong&page=2
export async function getUserList(req, res) {
    if (!req.user.role == "manager") {
        return res.status(403).json({ message: "Không đủ quyền truy cập." });
    }
    const numberOfUserPerPage = 30;
    let page = req.query.page || 1;
    const name = new RegExp(req.query.name, "gi")
    const query = User.find({ name: name });
    query.skip((page - 1) * numberOfUserPerPage)
        .limit(numberOfUserPerPage)
        .exec()
        .then((users) => {
            res.status(200).json({
                message: `Truy vấn thành công ${ users.length } đối tượng.`,
                users: users
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: "Lỗi hệ thống.",
                error: error.message
            })
        })
}

export async function getUserInforByID(req, res) {
    const _id = req.params.id;
    User.findById(_id)
    .exec()
    .then((user) => {
        res.status(200).json({
            message: `Truy vấn thành công.`,
            user: user
        })
    })
    .catch((error) => {
        res.status(500).json({
            message: "Lỗi hệ thống.",
            error: error.message
        })
    })
}
