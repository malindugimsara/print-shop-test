import Job from "../modules/job.js";
import nodemailer from "nodemailer";

    export const createJob = async (req, res) => {
        try {
            // ============================
            // AUTO-GENERATE JOB ID
            // ============================
            const jobs = await Job.find();
            let highestNumber = 0;

            jobs.forEach(job => {
                if (job.jobID && job.jobID.startsWith("J")) {
                    const numberPart = parseInt(job.jobID.substring(1));
                    if (!isNaN(numberPart) && numberPart > highestNumber) {
                        highestNumber = numberPart;
                    }
                }
            });

            const nextNumber = highestNumber + 1;
            const jobID = `J${nextNumber.toString().padStart(3, "0")}`;

            // ============================
            // VALIDATION
            // ============================

            // Validate customer details
            if (!req.body.name || !req.body.phoneNumber) {
                return res.status(400).json({ message: "Customer details are required" });
            }

            // Validate items
            if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
                return res.status(400).json({ message: "At least one job item is required" });
            }

            // Validate each item structure
            for (let item of req.body.items) {
                if (!item.type || !["tute", "cover", "other"].includes(item.type)) {
                    return res.status(400).json({ message: "Invalid item type" });
                }
                if (!item.data || typeof item.data !== "object") {
                    return res.status(400).json({ message: "Each job item must include data" });
                }
                if (!item.status) item.status = "Pending"; // default
            }

            // ============================
            // CREATE JOB DOCUMENT
            // ============================
            const job = new Job({
                jobID,

                // Customer info
                name: req.body.name,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                jobDate: req.body.jobDate || new Date(),
                needDate: req.body.needDate || new Date(),

                // MULTIPLE ITEMS
                items: req.body.items,   // <-- NEW ARRAY
            });

            // ============================
            // SAVE JOB
            // ============================
            await job.save();
            res.status(201).json(job);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to create job" });
        }
    };


    export function getJob(req, res) {
        
        // ADMIN → all jobs
        if (req.user.role === "admin") {
            Job.find()
                .then((jobs) => res.json(jobs))
                .catch(() => res.status(500).json({ message: "Job not found" }));
            return;
        }

        // USER → only their jobs
        Job.find({ email: req.user.email })
            .then((jobs) => res.json(jobs))
            .catch(() => res.status(500).json({ message: "Job not found" }));
    }

    export function getJobById(req, res) {
        if (!req.user) {
            return res.status(403).json({ message: "You need to login first" });
        }

        const jobID = req.params.id; // matches URL param

        Job.findOne({ jobID: jobID }) // <-- correct field name
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

        Job.findOneAndDelete({
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
            const updates = {
                ...req.body,
                updatedAt: Date.now()
            };

            const updatedJob = await Job.findOneAndUpdate(
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

