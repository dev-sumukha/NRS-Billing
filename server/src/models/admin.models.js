import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
            trim: true
        },
        password:{
            type: String,
            required: true,
            trim: true
        },
        customerCount:{
            type: Number
        }
    },
    {
        timestamps: true
    }
);

adminSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        next();
    }
    
    try {
        const saltRound = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password,saltRound);

        this.password = hashPassword;
    } catch (error) {
        next(error);
    }
});

adminSchema.methods.generateToken = async function(){
    try {
        return jwt.sign({_id: this._id},process.env.JWT_SECRET_KEY,{expiresIn: "1d"});
    } catch (error) {
        console.log("Error ",error);
        next(error);
    }
}

adminSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

export const Admin = mongoose.model("Admin",adminSchema);