import { Item } from "../models/items.models.js";
import { Customer } from "../models/customers.models.js";
import { Voucher } from "../models/voucher.models.js";

export const createItem = async (req, res) => {
    const { itemName, company, rate, caseQuantity, stock } = req.body;

    if (!itemName || !company || !rate || !caseQuantity || !stock) {
        return res.status(400).json({ success: false, message: "All fields are mandatory" });
    }

    try {
        const item = await Item.create({ itemName, company, rate, caseQuantity, stock });

        if (!item) {
            return res.status(400).json({ success: false })
        }

        res.status(201).json({ success: true, message: "Item Created Successfully",item });
    } catch (error) {
        console.log("Error ", error);
        res.status(500).json({ success: false, message: "Item Creation failed" });
    }
}

export const getItems = async (req,res) => {
    try {
        const itemsList = await Item.find();
        res.status(200).json({ success: true, message: "Items list", itemsList });
    } catch (error) {
        console.log("Error ",error.message);
    }
}

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedItem = await Item.deleteOne({ _id: id });
        console.log(deletedItem);
        
        if (!deletedItem) {
            return res.status(400).json({ success: false, message: "Something went wrong" });
        }

        res.status(200).json({ success: true, message: "Item deleted" });
    } catch (error) {
        console.log("Error ", error);
    }
}

export const suggestItemsToVoucher = async (req, res) => {
    const { query } = req.query; // Ensure frontend sends query in the body
    console.log("Query received:", req.query);
    try {
        const itemList = await Item.find({
            itemName: { $regex: "^" + query, $options: "i" },
        }).select("itemName rate caseQuantity company");
        
        console.log("Item List:", itemList);
        res.status(200).json({ success: true, message: "Items List", itemList });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// export const addItemsToVoucher = async (req, res) => {
//     try {
//         const { customerId, voucherId } = req.params;
//         const { items } = req.body; // get the array of items 

//         try {
//             const voucher = await Voucher.findOne({ _id: voucherId, customer: customerId });

//             if (!voucher) {
//                 return res.status(404).json({ message: "Voucher not found for the given customer" });
//             }
//             voucher.items.push(...items);

//             await voucher.save();

//             res.status(201).json({ success: true, message: "items added to voucher" });
//         } catch (error) {
//             console.log("Error ",error);
//         }
//     } catch (error) {
//         console.log("Error ",error);
//     }
// }

export const addItemsToVoucher = async (req, res) => {
    try {
        const { customerId, voucherId } = req.params; // Extract params
        const { items } = req.body; // Get new items from the request body

        // Validate items array
        // if (!Array.isArray(items) || items.length === 0) {
        //     return res.status(400).json({ message: "Items must be a non-empty array" });
        // }

        // // Find the voucher and ensure it belongs to the given customer
        // const voucher = await Voucher.findOne({ _id: voucherId, customer: customerId });
        // if (!voucher) {
        //     return res.status(404).json({ message: "Voucher not found for the given customer" });
        // }

        // // Extract item IDs from the input
        // const itemIds = items.map((item) => item.item);

        // // Fetch the items from the database
        // const existingItems = await Item.find({ _id: { $in: itemIds } });

        // if (existingItems.length !== itemIds.length) {
        //     return res.status(400).json({
        //         message: "Some items do not exist in the database",
        //     });
        // }

        // // Map items with the correct rate and calculate amount
        // voucher.items = items.map((itemInput) => {
        //     const itemFromDB = existingItems.find((dbItem) => dbItem._id.toString() === itemInput.item);

        //     if (!itemFromDB) {
        //         throw new Error(`Item with ID ${itemInput.item} not found`);
        //     }

        //     const rate = itemFromDB.rate; // Assuming `price` field exists in `Item` schema
        //     const amount = itemInput.quantity * rate;

        //     return {
        //         item: itemInput.item,
        //         quantity: itemInput.quantity,
        //         rate,
        //         amount,
        //     };
        // });

        // // Calculate the total amount
        // voucher.totalAmount = voucher.items.reduce((sum, item) => sum + item.amount, 0);

        // // Save the updated voucher
        // await voucher.save();

        // res.status(200).json({
        //     success: true,
        //     message: "Voucher items updated successfully",
        //     voucher,
        // });

        console.log(items);
    } catch (error) {
        console.error("Error updating voucher items:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// use effect, memo -> 