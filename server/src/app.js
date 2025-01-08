import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
app.use(express.static("public"));

import adminRoutes from "./routes/admin.routes.js";
import itemRoutes from "./routes/items.routes.js";
import customerRoutes from "./routes/customers.routes.js";
import voucherRoutes from "./routes/vouchers.routes.js";

app.use("/api/auth",adminRoutes);
app.use("/api/items",itemRoutes);
app.use("/api/customer",customerRoutes);
app.use("/api/customer/voucher",voucherRoutes);

export default app;