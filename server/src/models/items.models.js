import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        itemName:{
            type: String,
            required: true
        },
        company:{
            type: String,
            required: true
        },
        rate:{
            type: Number,
            required: true
        },
        caseQuantity:{
            type: Number,
            required: true
        },
        stock:{
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Item = mongoose.model("Item",itemSchema);