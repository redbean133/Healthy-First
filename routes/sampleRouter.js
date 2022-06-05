import express from "express";
import authentication from "../middlewares/authenticationMiddleware.js";

const router = express.Router();
// router.get("/infor", authentication, getInformation);
// router.put("/infor", authentication, changeInformation);

export default router;