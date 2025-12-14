import express from 'express';
import { createJob, deleteJob, getJob, getJobById, updateJob } from '../controller/jobController.js';



const jobRouter = express.Router();

jobRouter.post('/', createJob )
jobRouter.get('/', getJob);
jobRouter.delete('/:jobID', deleteJob)
jobRouter.put('/:jobID', updateJob);
jobRouter.get('/:id', getJobById)


export default jobRouter;