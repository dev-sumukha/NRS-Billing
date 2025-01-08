import { Customer } from "../models/customers.models.js";


export const createCustomer = async (req,res) => {
    const { customerName, shopName, GSTNumber, place } = req.body;

    try {
        if(!customerName || !shopName){
            return res.status(400).json({success: false, message: "All "})
        }
        
        const customer = await Customer.create({customerName, shopName, GSTNumber, place});

        if(!customer){
            return res.status(400).json({success: false, message: "Could not create customer"});
        }

        res.status(201).json({success: true, message: "Customer created successfully",customer});
    } catch (error) {
        console.log("Error ",error);
    }
}

export const deleteCustomer = async (req,res) => {
    try {
        const { cid } = req.params;

        const customer = await Customer.deleteOne({_id:cid});

        res.json(customer);
    } catch (error) {
        console.log("Error ",error);
    }
}

export const getCustomers = async (req,res) => {
    try {
        const customerList = await Customer.find();
        res.status(200).json({success: true, message: "Customer details", customerList});
    } catch (error) {
        console.log("Error ",error);
    }
}