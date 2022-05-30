import jsonwebtoken from "jsonwebtoken";
import { getUserById } from "../controllers/userController.js";

export default function authentication(req, res, nextFunction) {
    const accessToken = req.header("Authorization");
    if (!accessToken) {
        return res.status(400).json({ message: "Invalid authentication."});
    }
    jsonwebtoken.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (error, result) => {
        if (error) {
            return res.status(400).json({ message: "Invalid authentication."});
        }
        // Set req.user thành user vừa verify để nextFunction() có thể truy cập thông tin của user.
        // Do khi tạo Token ta chỉ truyền vào một đối tượng { id: value } nên khi giải mã sẽ nhận lại
        // đối tượng user chỉ bao gồm trường id [ lưu ý user này không thuộc model User ].
        getUserById(result.id).then((user) => {
            req.user = user;
            nextFunction();
        });
    })
}