import express from "express";
const router = express.Router();

import { addItemsToVoucher, createItem, deleteItem, getItems, suggestItemsToVoucher, getVoucherDetails } from "../controllers/items.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js"

router.post("/createItem",authMiddleware,createItem);
router.get("/getItems",authMiddleware,getItems);
router.delete("/deleteItem/:id",authMiddleware,deleteItem);
router.post("/suggestItems",suggestItemsToVoucher);

// add items for a particular voucher of a particular customer
router.put("/customers/:customerId/vouchers/:voucherId/addItems",authMiddleware,addItemsToVoucher);
router.get("/customers/:customerId/vouchers/:voucherId", getVoucherDetails);


export default router;
// localhost:3000/api/customer/voucher/customers/:customerId/vouchers/:voucherId/addItems
// localhost:3000/api/customer/voucher/customers/678752470a910da5f171258e/vouchers/6787525a0a910da5f1712591/addItems