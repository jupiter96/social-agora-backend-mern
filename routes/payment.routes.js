import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getPayments,
  getstatistics,
  getChartData,
  getPayment
} from "../controllers/payment.controller.js";

const router = express.Router();

router.route("/getpayments").get(verifyJWT, getPayments);

router.route("/getpaymentstatistics").get(getstatistics);

router.route("/getpaymentchart").get(getChartData);

router.route("/:id").get(getPayment);

export default router;
