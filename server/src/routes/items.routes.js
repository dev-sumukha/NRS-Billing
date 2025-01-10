import express from "express";
const router = express.Router();

import { addItemsToVoucher, createItem, deleteItem, getItems, suggestItemsToVoucher } from "../controllers/items.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js"

router.post("/createItem",authMiddleware,createItem);
router.get("/getItems",authMiddleware,getItems);
router.delete("/deleteItem/:id",authMiddleware,deleteItem);
router.get("/suggestItems",suggestItemsToVoucher);

// add items for a particular voucher of a particular customer
router.put("/customers/:customerId/vouchers/:voucherId/addItems",addItemsToVoucher);
export default router;