import mongoose from "mongoose";

const jobCustomerSchema = new mongoose.Schema({
    jobID : {
        type: String,
        required: true,
        unique: true
    },
    name : {
        type: String,
        required: true
    },
   
    email : {
        type: String,
        required: true
    },
    phoneNumber : {
        type: String,
        required: true,
    },
    
    details : {
        type: String,
        required: true
    },
    needDate : {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Pending'
    },
    images : {
        type: [String]
    }
    
})

const JobCustomer = mongoose.model("jobCustomer", jobCustomerSchema);
export default JobCustomer;