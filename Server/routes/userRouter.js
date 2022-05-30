import express from "express";
import { registerAccount, login, logout, refreshToken, getInformation, changeInformation, 
    setAreas, deleteAccount, getUserList, fakeData } from "../controllers/userController.js";
import authentication from "../middlewares/authenticationMiddleware.js";
import authenticationManager from "../middlewares/authenticationManagerMiddleware.js";

const router = express.Router();

router.post("/register", registerAccount);
router.post("/login", login);
router.get("/logout", logout);

router.get("/infor", authentication, getInformation);
router.put("/infor", authentication, changeInformation);
router.delete("/delete/:id", authentication, deleteAccount);

router.patch("/manage/set_areas/:expertId", authentication, setAreas);
router.get("/manage", authentication, getUserList);

router.get("/refresh_token", refreshToken);

// Fake data
router.get("/fakedata", fakeData);

export default router;