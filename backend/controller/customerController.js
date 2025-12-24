import Customer from "../modules/customer.js";
import dotenv from "dotenv";
dotenv.config();

// This function saves a new user to the database
export function createCustomer(req, res) {
    if (req.body.role == "admin") {
        if (req.user == null) {
            return res.status(403).json({
                message: "Please login as an admin to create a new customer"
            });
        }
        
    }
    const customer =new Customer({
        email: req.body.email,
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        isDisable: req.body.isDisable || false, // Default isDisable to false
    })

    // ✅ PHONE NUMBER VALIDATION
    if (!/^\d{10}$/.test(req.body.phoneNumber)) {
        return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    customer.save().then(()=> {
        res.json({
            message: "Customer created successfully"
        })
    }).catch((err) => {
        console.error("Error creating Customer:", err);
        res.status(500).json({
            message: "Error creating user",
            error: err.message
        });
    })
}

// ==================================
// 🔍 AUTOCOMPLETE CUSTOMER BY NAME
// ==================================
export const searchCustomerByName = async (req, res) => {
  try {
    const { name } = req.params;

    const customers = await Customer.find({
      name: { $regex: `^${name}`, $options: "i" },
    })
      .limit(10)
      .select("name email phoneNumber");

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==================================
// 📧 CHECK CUSTOMER BY phone number
// ==================================
export const getCustomerByPhoneNumber = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      phoneNumber: req.params.phoneNumber,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export function getAllCustomers(req, res) {
    if (req.user == null) {
        return res.status(403).json({
            message: "You need to login first"
        });
    }

    Customer.find().then((customers) => {
        res.json(customers);
    }).catch((err) => {
        console.error("Error fetching customers:", err);
        res.status(500).json({
            message: "Error fetching customers",
            error: err.message
        });
    });
}

export function deleteCustomer(req, res) {
  if (req.user == null) {
    return res.status(403).json({ message: "You need to login first" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "You are not authorized to delete a Customer" });
  }

  Customer.findByIdAndDelete(req.params.customerID)
    .then((Customer) => {
      if (!Customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json({ message: "Customer deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error deleting Customer",
        error: err.message,
      });
    });
}

export function updateCustomer(req, res) {
  if (req.user == null) {
    res.status(403).json({
      message: "You need to login first",
    });
    return;
  }

  // Assuming you're using MongoDB with Mongoose and User model
  Customer.findByIdAndUpdate(req.params.customerID, req.body, { new: true })
    .then((customer) => {
      if (!customer) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }

      if (!/^\d{10}$/.test(req.body.phoneNumber)) {
          return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
      }

      res.json({
        message: "Customer updated successfully",
        customer,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error updating customer",
        error: err.message,
      });
    });
}