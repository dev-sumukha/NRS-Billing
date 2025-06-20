import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
    {   

        serialNumber:{
            type: Number,
        },
        date:{
            type: Date,
        },        
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },
        items: [
            {
                item: {
                    type: String,
                    required: true,
                    trim: true
                },
                companyName:{
                    type: String,
                    required: true,
                    trim: true
                },
                qty: {
                    type: Number,
                    required: true,
                    trim: true
                },
                rate: {
                    type: Number,
                    required: true,
                    trim: true
                },
                amount: {
                    type: Number,
                    required: true,
                    trim: true
                }
            }
        ],
        totalAmount: {
            type: Number,
            default: 0
        },
        status:{
            type: String,
            enum: ["paid","unpaid"],
            default: "unpaid"
        },
        savedStatus:{
            type: String,
            enum: ["draft","final"],
            default: "draft"
        }
    },
    {
        timestamps: true
    }
);

export const Voucher = mongoose.model("Voucher", voucherSchema);