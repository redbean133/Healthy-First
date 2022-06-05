import express from "express";
import { addNewSample, changeInformation, getDetailInformation, deleteSample } from "../controllers/sampleController.js";
import authentication from "../middlewares/authenticationMiddleware.js";

const router = express.Router();

router.post("/", authentication, addNewSample);
router.put("/:id", authentication, changeInformation);
router.get("/:id", authentication, getDetailInformation);
router.delete("/:id", authentication, deleteSample);

export default router;