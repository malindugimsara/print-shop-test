import JobCustomer from "../modules/jobCustomer.js";
import nodemailer from "nodemailer";

export const createJob = async (req, res) => {
    try {
        // get all jobs
        const jobs = await JobCustomer.find();

        let highestNumber = 0;

        jobs.forEach(job => {
            if (job.jobID && job.jobID.startsWith("J")) {
                const numberPart = parseInt(job.jobID.substring(2));
                if (!isNaN(numberPart) && numberPart > highestNumber) {
                    highestNumber = numberPart;
                }
            }
        });

        const nextNumber = highestNumber + 1;
        const jobID = `JC${nextNumber.toString().padStart(3, "0")}`;

        const job = new JobCustomer({
            jobID,
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            details: req.body.details,
            needDate: req.body.needDate,
            status: req.body.status || "Pending",
            images: req.body.images || [],
        });

        await job.save();
        res.status(201).json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create job" });
    }
};

    export function getJob(req, res) {
        if (!req.user) {
            return res.status(403).json({ message: "You need to login first" });
        }

        // ADMIN → all jobs
        if (req.user.role === "admin") {
            JobCustomer.find()
                .then((jobs) => res.json(jobs))
                .catch(() => res.status(500).json({ message: "Job not found" }));
            return;
        }

        // USER → only their jobs
        JobCustomer.find({ email: req.user.email })
            .then((jobs) => res.json(jobs))
            .catch(() => res.status(500).json({ message: "Job not found" }));
    }

    export function getJobById(req, res) {
        if (!req.user) {
            return res.status(403).json({ message: "You need to login first" });
        }

        const jobID = req.params.id; // matches URL param

        JobCustomer.findOne({ jobID: jobID }) // <-- correct field name
            .then((job) => {
                if (!job) {
                    return res.status(404).json({ message: "Job not found" });
                }

                // Optional: restrict access for non-admin users
                if (req.user.role !== "admin" && job.email !== req.user.email) {
                    return res.status(403).json({ message: "You cannot access this job" });
                }

                res.json(job);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ message: "Server error", error: err.message });
            });
    }

    export function deleteJob(req, res){
        if (req.user== null){
            res.status(403).json({
                message: "You need to login first"
            });
            return;
        }
        if (req.user.role != "admin"){
            res.status(403).json({
                message: "You are not authorized to delete a job"
            });
            return;
        }

        JobCustomer.findOneAndDelete({
            jobID: req.params.jobID
        })
        .then(() => {
            res.json({
                message: "Job deleted successfully"
            });
        }).catch((err) => {
            res.status(500).json({
                message: "Error deleting job",
                error: err.message
            });
        });
    }

    export async function updateJob(req, res){
        if (req.user == null) {
            res.status(403).json({
                message: "You need to login first"
            });
            return;
        }

        try {
            console.log('[updateJob] req.params.jobID =', req.params.jobID, 'by user =', req.user?.email || req.user?.name);
            // Ensure updatedAt and allow updating currentLocation/status
            const updates = {
                ...req.body,
                updatedAt: Date.now()
            };

            const updatedJob = await JobCustomer.findOneAndUpdate(
                { jobID: req.params.jobID },
                updates,
                { new: true }
            );

            if (!updatedJob) {
                console.warn('[updateJob] job not found for ID', req.params.jobID);
                return res.status(404).json({ message: 'Job not found' });
            }

            res.json({
                message: "Job updated successfully",
                data: updatedJob
            });
        } catch (err) {
            res.status(500).json({
                message: "Error updating job",
                error: err.message
            });
        }
    }

