import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
    },

    phoneNumber: {
        type: String,
        required: true
    },

    jobDate: {
        type: Date,
        default: Date.now
    },

    needDate: {
        type: Date,
        default: Date.now
    },

    items: [
        {
            type: {
                type: String,
                enum: ["tute", "cover", "other"],
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
            status: {
                type: String,
                default: "Pending"
            }
        }
    ],
});

const Job = mongoose.model("job", jobSchema);
export default Job;
