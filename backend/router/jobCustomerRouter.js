import express from "express";
import { createJob, deleteJob, getJob, getJobById, updateJob } from "../controller/jobCustomerController.js";


const jobCustomerRouter = express.Router();

jobCustomerRouter.post('/', createJob )
jobCustomerRouter.get('/', getJob);
jobCustomerRouter.delete('/:jobID', deleteJob)
jobCustomerRouter.put('/:jobID', updateJob);
jobCustomerRouter.get('/:id', getJobById)

export default jobCustomerRouter;