import { Admin } from "../models/admin.models.js";

export const adminRegister = async (req,res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.create({email,password});

        if(!admin){
            return res.status(400).json({success: false, message: "Something went wrong"});
        }

        res.status(201).json({success: true,message: "Admin created"});
    } catch (error) {
        console.log("Error ",error);
    }
}

export const adminLogin = async (req,res) => {
    const { email, password } = req.body;

    try {
        const isAdminExist = await Admin.findOne({email});

        if(!isAdminExist){
            return res.status(400).json({success: false, message: "Admin does not exist"});
        }

        const isPasswordCorrect = await isAdminExist.comparePassword(password);

        if(!isPasswordCorrect){
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }
        
        const token = await isAdminExist.generateToken();
        res.status(200).json({success: true, message: "Login successful", token:token});

    } catch (error) {
        console.log("Error ",error);
    }
}