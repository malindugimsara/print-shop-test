import express from "express";
import { createJob, deleteJob, getJob, updateJob } from "../controller/jobCustomerController.js";


const jobCustomerRouter = express.Router();

jobCustomerRouter.post('/', createJob )
jobCustomerRouter.get('/', getJob);
jobCustomerRouter.delete('/:jobID', deleteJob)
jobCustomerRouter.put('/:jobID', updateJob);

export default jobCustomerRouter;