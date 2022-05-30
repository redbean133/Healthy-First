import express from "express";
import authentication from "../middlewares/authenticationMiddleware.js";
import authenticationManager from "../middlewares/authenticationManagerMiddleware.js";
import { addNewFacility, getFacilityList, filterByCertificateState } from "../controllers/facilityController.js";

const router = express.Router();
router.post("/add", authentication, addNewFacility)
router.get("/", authentication, getFacilityList);

router.get("/filter-by-certificate", authentication, filterByCertificateState);

export default router;