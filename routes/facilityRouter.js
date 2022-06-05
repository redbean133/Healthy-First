import express from "express";
import authentication from "../middlewares/authenticationMiddleware.js";
import { addNewFacility, getFacilityList, filterByCertificateState, changeInformation,
    deleteFacility } from "../controllers/facilityController.js";

const router = express.Router();
router.post("/add", authentication, addNewFacility);
router.get("/", authentication, getFacilityList);
router.put("/:id", authentication, changeInformation);
router.delete("/:id", authentication, deleteFacility);
router.get("/filter-by-certificate", authentication, filterByCertificateState);

export default router;