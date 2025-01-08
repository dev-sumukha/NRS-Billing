import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true
        },
        shopName:{
            type: String,
            required: true
        },
        GSTNumber:{
            type: String,
            default: "-",
        },
        amountBalance: {
            type: Number,
            default: 0
        },
        amountPaid: {
            type: Number,
            default: 0
        },
        place:{
            type: String
        },
        vouchers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Voucher"
            }
        ]
    },
    {
        timestamps: true
    }
);

export const Customer = mongoose.model("Customer", customerSchema);