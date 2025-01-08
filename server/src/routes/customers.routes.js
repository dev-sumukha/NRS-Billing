import express from "express";
const router = express.Router();

import { createCustomer, deleteCustomer, getCustomers } from "../controllers/customers.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

router.post("/createCustomer",authMiddleware,createCustomer);
router.get("/getCustomers",getCustomers)
router.put("/updateCustomer/:cid",authMiddleware,getCustomers);
router.delete("/deleteCustomer/:cid",authMiddleware,deleteCustomer);

export default router;