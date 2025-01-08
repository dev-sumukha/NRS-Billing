import express from "express";
const router = express.Router();

import { createVoucher, updateVoucher, getVouchers } from "../controllers/voucher.controllers.js";

router.post("/createVoucher/:customerId",createVoucher);
router.get("/getVouchers/:customerId",getVouchers);
router.put("/updateVoucher/:voucherId",updateVoucher);

export default router;