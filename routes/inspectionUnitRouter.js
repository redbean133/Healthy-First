import express from "express";
import { addNewInspectionUnit, changeInformation, getInformation, getInspectionUnitList } from "../controllers/inspectionUnitController.js";
import authentication from "../middlewares/authenticationMiddleware.js";
import authenticationManager from "../middlewares/authenticationManagerMiddleware.js";

const router = express.Router();
router.use(authentication, authenticationManager);

router.post("/", addNewInspectionUnit);
router.get("/", getInspectionUnitList);

router.put("/:id", changeInformation);
router.get("/:id", getInformation);

export default router;