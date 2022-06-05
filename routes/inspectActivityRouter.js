import express from "express";
import { addNewInspectActivity, getListInspectActivity, updateActivity, makeStatistical } from "../controllers/inspectActivityController.js";
import authentication from "../middlewares/authenticationMiddleware.js";

const router = express.Router();

router.post("/", authentication, addNewInspectActivity);
router.get("/", authentication, getListInspectActivity);
router.put("/:id", authentication, updateActivity);
router.post("/statistic", authentication, makeStatistical);


export default router;