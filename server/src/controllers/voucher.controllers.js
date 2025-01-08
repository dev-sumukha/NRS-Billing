import { Voucher } from "../models/voucher.models.js";
import { Customer } from "../models/customers.models.js";
import { Item } from "../models/items.models.js";
 
export const createVoucher = async (req, res) => {
    const { customerId } = req.params;

    try {
        const customer = await Customer.findById(customerId);
  
        if (!customer) {
            return res.status(404).json({ status: false, message: "Customer not found" });
        }

        const voucher = new Voucher({ customer: customerId, items: [] });

        voucher.serialNumber = customer.vouchers.length + 1;

        await voucher.save();

        customer.vouchers.push(voucher._id);
        await customer.save();

        console.log("Voucher serial number:", voucher.serialNumber);

        res.status(201).json({ success: true, message: "Draft voucher created successfully", voucher });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
};


export const getVouchers = async(req,res) =>{
    // get the customer id
    // then fetch from populate function
    try {
        const { customerId } = req.params;
        // customerName: customer.customerName, shopName: customer.shopName, GSTNumber: customer.GSTNumber
        const customerDetails = await Customer.findById({_id:customerId}).select("customerName shopName GSTNumber place");
        
        const customerVoucherList = await Customer.findById({_id:customerId}).select("vouchers").populate("vouchers");

        res.status(200).json({success: true, message: "Voucher List", customerVoucherList,customerDetails});
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