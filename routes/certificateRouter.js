import express from "express";
import authentication from "../middlewares/authenticationMiddleware.js";
import { addCertificate, extend, revoke, getCertificateList, makeStatistical, getDetail } from "../controllers/certificateController.js";

const router = express.Router();
router.post("/", authentication, addCertificate);
router.get("/:id", authentication, getDetail);
router.patch("/extend/:id", authentication, extend);
router.patch("/revoke/:id", authentication, revoke);

router.get("/", authentication, getCertificateList);
router.post("/statistic", authentication, makeStatistical);

export default router;