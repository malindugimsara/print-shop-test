import JobCustomer from "../modules/jobCustomer.js";
import nodemailer from "nodemailer";

export const createJob = async (req, res) => {
    try {
        // get all jobs
        const jobs = await JobCustomer.find();

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

            // Emit real-time update to admin panel via Socket.io (if available)
            // try {
            //     const io = req.io;
            //     if (io) {
            //         io.to('adminPanel').emit('parcelLocationUpdated', {
            //             parcelID: updatedParcel.parcelID,
            //             newLocation: updatedParcel.currentLocation || updates.currentLocation,
            //             status: updatedParcel.status,
            //             updatedBy: req.user.email || req.user.name || 'system',
            //             timestamp: updatedParcel.updatedAt || new Date().toISOString()
            //         });
            //         console.log('[updateParcel] Emitted parcelLocationUpdated for', updatedParcel.parcelID);
            //     }
            // } catch (emitErr) {
            //     console.warn('Failed to emit parcelLocationUpdated event:', emitErr);
            // }

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

// search parcel by ID


// export function searchParcel(req, res) {
//     if (req.user == null) {
//         res.status(403).json({
//             message: "You need to login first"
//         });
//         return;
//     }

//     Parcel.findOne({ parcelID: req.params.parcelID })
//         .then((parcel) => {
//             if (!parcel) {
//                 return res.status(404).json({
//                     message: "Parcel not found !!!"
//                 });
//             }
//             res.json(parcel);
//         })
//         .catch((err) => {
//             res.status(500).json({
//                 message: "Error retrieving parcel",
//                 error: err.message
//             });
//         });
// }

// export async function emailParcelDetails(req,res){
//     const {
//     parcelID,
//     name,
//     email,
//     address_line1,
//     city,
//     district,
//     details,
//     estimateDate,
//     status,
//   } = req.body;

//   try{
//     const transport = nodemailer.createTransport({
//       service: 'gmail',
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       auth:{
//         user: "postalmanagement64@gmail.com",
//         pass: "smdbujtchclirafc"
//       }
//     })

//     const subject = `📦 Parcel Confirmation - ${parcelID}`;

//      const message = `
// Hello ${name},

// Your parcel has been successfully registered in our system. Below are the details:

// 📦 Parcel Information
// ----------------------------
// Parcel ID     : ${parcelID}
// Name          : ${name}
// Email         : ${email}
// Address       : ${address_line1}
// City          : ${city}
// District      : ${district || "N/A"}
// Details       : ${details || "N/A"}
// Estimate Date : ${estimateDate || "Not Provided"}
// Status        : ${status}

// We will keep you updated as your parcel progresses.

// Thank you,
// Smart Postal Management System
// `;

// await transport.sendMail({
//       from: "postalmanagement64@gmail.com",
//       to: email,
//       subject: subject,
//       text: message, // plain text version
//       html: `
//         <h2>📦 Parcel Confirmation</h2>
//         <p>Hello <strong>${name}</strong>,</p>
//         <p>Your parcel has been successfully registered in our system. Below are the details:</p>
//         <table border="1" cellspacing="0" cellpadding="8">
//           <tr><td><b>Parcel ID</b></td><td>${parcelID}</td></tr>
//           <tr><td><b>Name</b></td><td>${name}</td></tr>
//           <tr><td><b>Email</b></td><td>${email}</td></tr>
//           <tr><td><b>Address</b></td><td>${address_line1}</td></tr>
//           <tr><td><b>City</b></td><td>${city}</td></tr>
//           <tr><td><b>District</b></td><td>${district}</td></tr>
//           <tr><td><b>Details</b></td><td>${details}</td></tr>
//           <tr><td><b>Estimate Date</b></td><td>${estimateDate || "Not Provided"}</td></tr>
//           <tr><td><b>Status</b></td><td>${status}</td></tr>
//         </table>
//         <p>We will keep you updated as your parcel progresses.</p>
//         <br>
//         <p>Thank you,<br>Smart Postal Management System</p>
//       `,
//     });

//     res.status(200).json({
//         message:"Email sent Successfully"
//     });

//   }catch(err){
//     console.log("Error sending Email:", err);
//     res.status(500).json({
//         message:"Error sending Email",
//         error: err.message
//     });
//   }
// }


// export async function emailUpdatedParcelDetails(req,res){
//     const {
//     parcelID,
//     name,
//     email,
//     address_line1,
//     city,
//     district,
//     details,
//     estimateDate,
//     status,
//   } = req.body;

//   try{
//     const transport = nodemailer.createTransport({
//       service: 'gmail',
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       auth:{
//         user: "postalmanagement64@gmail.com",
//         pass: "smdbujtchclirafc"
//       }
//     })

//     const subject = `📦 Your Parcel Update - ${parcelID} | Status: ${status}`;

//      const message = `
// Hello ${name},

// Your parcel has been successfully updated in our system. Below are the updated details:

// 📦 Parcel Information
// ----------------------------
// Parcel ID     : ${parcelID}
// Name          : ${name}
// Email         : ${email}
// Address       : ${address_line1}
// City          : ${city}
// District      : ${district || "N/A"}
// Details       : ${details || "N/A"}
// Estimate Date : ${estimateDate || "Not Provided"}
// Status        : ${status}

// We will keep you updated as your parcel progresses.

// Thank you,
// Smart Postal Management System
// `;

// await transport.sendMail({
//       from: "postalmanagement64@gmail.com",
//       to: email,
//       subject: subject,
//       text: message, // plain text version
//       html: `
//         <h2>📦 Parcel Details has been changed</h2>
//         <p>Hello <strong>${name}</strong>,</p>
//         <p>Your parcel has been successfully updated in our system. Below are the updated details:</p>
//         <table border="1" cellspacing="0" cellpadding="8">
//           <tr><td><b>Parcel ID</b></td><td>${parcelID}</td></tr>
//           <tr><td><b>Name</b></td><td>${name}</td></tr>
//           <tr><td><b>Email</b></td><td>${email}</td></tr>
//           <tr><td><b>Address</b></td><td>${address_line1}</td></tr>
//           <tr><td><b>City</b></td><td>${city}</td></tr>
//           <tr><td><b>District</b></td><td>${district}</td></tr>
//           <tr><td><b>Details</b></td><td>${details}</td></tr>
//           <tr><td><b>Estimate Date</b></td><td>${estimateDate || "Not Provided"}</td></tr>
//           <tr><td><b>Status</b></td><td>${status}</td></tr>
//         </table>
//         <p>We will keep you updated as your parcel progresses.</p>
//         <br>
//         <p>Thank you,<br>Smart Postal Management System</p>
//       `,
//     });

//     res.status(200).json({
//         message:"Email sent Successfully"
//     });

//   }catch(err){
//     console.log("Error sending Email:", err);
//     res.status(500).json({
//         message:"Error sending Email",
//         error: err.message
//     });
//   }
// }
