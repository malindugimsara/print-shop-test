import mongoose from "mongoose";

// Define the schema for the user
const customerSchema = new mongoose.Schema ({
    email : {
        type: String,
        default: "Not given",
        lowercase: true,
        trim: true,
    },
    name : {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber : {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    isDisable : {
        type: Boolean,
        default: false
    },
}, { timestamps: true }
) 

// Create a model from the schema
const Customer = mongoose.model("customer", customerSchema); 
export default Customer;