import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import facilityRouter from "./routes/facilityRouter.js";
import certificateRouter from "./routes/certificateRouter.js";
import inspectActivityRouter from "./routes/inspectActivityRouter.js";
import inspectionUnitRouter from "./routes/inspectionUnitRouter.js";
import sampleRouter from "./routes/sampleRouter.js";

const app = express();
app.use(cors());
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", userRouter);
app.use("/facility", facilityRouter);
app.use("/certificate", certificateRouter);
app.use("/inspect-activity", inspectActivityRouter);
app.use("/inspection-unit", inspectionUnitRouter);
app.use("/sample", sampleRouter);

dotenv.config();
const URI = process.env.MONGODB_URI;
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected!");
}).catch((error) => {
    console.log("Error connecting to database!");
});

const port = 5000;
app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}!`);
});