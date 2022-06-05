import express from "express";
import { addNewInspectActivity } from "../controllers/inspectActivityController.js";
import authentication from "../middlewares/authenticationMiddleware.js";

const router = express.Router();

router.post("/add", authentication, addNewInspectActivity);
// router.get("/infor", authentication, getInformation);
// router.put("/infor", authentication, changeInformation);

export default router;