import express from 'express';
import { createCustomer, deleteCustomer, getAllCustomers, getCustomerByPhoneNumber, searchCustomerByName, updateCustomer } from '../controller/customerController.js';

const customerRouter = express.Router();

customerRouter.post('/',createCustomer)
customerRouter.get('/phoneNumber/:phoneNumber', getCustomerByPhoneNumber)
customerRouter.get('/name/:name', searchCustomerByName)
customerRouter.get('/', getAllCustomers)
customerRouter.delete('/:customerID', deleteCustomer)
customerRouter.put('/:customerID', updateCustomer)

export default customerRouter;