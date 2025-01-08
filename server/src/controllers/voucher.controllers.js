import { Voucher } from "../models/voucher.models.js";
import { Customer } from "../models/customers.models.js";
import { Item } from "../models/items.models.js";
 
export const createVoucher = async (req,res) => {
    const { customerId } = req.params;

    try {
        const customer = await Customer.findById({_id:customerId});

        if(!customer){
            return res.status(404).json({status: false, message: "Customer not found"});
        }

        const voucher = await Voucher.create({customer: customerId, items:[]});

        // adding voucher to the customer schema
        customer.vouchers.push(voucher._id);
        await customer.save();
        
        res.status(201).json({success: true, message: "Draft voucher created successfully", voucher});
    } catch (error) {
        console.log("Error ",error);
    }
}

export const getVouchers = async(req,res) =>{
    // get the customer id
    // then fetch from populate function
    try {
        const { customerId } = req.params;
        
        const customerVoucherList = await Customer.findById({_id:customerId}).select("vouchers").populate("vouchers");
        console.log(customerVoucherList);

        res.status(200).json({success: true, message: "Voucher List", customerVoucherList});
    } catch (error) {
        console.log("Error ",error);
    }
}

export const updateVoucher = async (req,res) => {
    try {
        const { voucherId } = req.params;
        const { items } = req.body;

        const voucher = await Voucher.findById({_id:voucherId});

        if(!voucher){
            return res.status(404).json({success: false, message: "Voucher not found"});
        }

        let totalAmount = voucher.totalAmount;

        for(let entry of items){
            const { itemName, quantity, rate, amount } = entry;

            // fetch item by name
            const dbItem = await Item.findOne({itemName});

            if(!dbItem){
                return res.status(404).json({success: false, message: "Item not found"});
            }

            totalAmount += amount;

            voucher.items.push({item: dbItem._id, quantity, rate, amount});

            voucher.totalAmount = totalAmount;
            await voucher.save();

        }
        res.status(200).json({success: true, message: "Items added to voucher successfully"});

    } catch (error) {
        console.log("Error ",error);
    }
}