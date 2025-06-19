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
  const { query } = req.body;
  if (!query) return res.json([]);

  try {
    const products = await Item.find({
      itemName: { $regex: query, $options: "i" }
    });

    console.log(products);
    
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Suggestion error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const addItemsToVoucher = async (req, res) => {
  try {
    const { customerId, voucherId } = req.params;
    const { items } = req.body;

    console.log("Incoming Items Count:", items?.length || 0);
    console.log(items);

    // Validation
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items must be a non-empty array" });
    }

    for (const item of items) {
      if (
        !item.item ||
        !item.companyName ||
        typeof item.qty !== "number" ||
        typeof item.rate !== "number" ||
        typeof item.amount !== "number"
      ) {
        return res.status(400).json({ message: "Invalid item structure" });
      }
    }

    // Calculate new total
    const newTotal = items.reduce((sum, i) => sum + i.amount, 0);

    // Update: REPLACE items array and totalAmount
    const updated = await Voucher.findOneAndUpdate(
      { _id: voucherId, customer: customerId },
      {
        $set: {
          items: items,
          totalAmount: newTotal,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Voucher not found for this customer" });
    }

    res.status(200).json({
      message: "Items replaced successfully",
      totalItems: items.length,
      newTotalAmount: newTotal,
      voucher: updated
    });

  } catch (error) {
    console.error("Error replacing items in voucher:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};


export const getVoucherDetails = async (req, res) => {
  try {
    const { customerId, voucherId } = req.params;
    const voucher = await Voucher.findOne({ _id: voucherId, customer: customerId });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    console.log(voucher);
    res.status(200).json({ voucher });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
