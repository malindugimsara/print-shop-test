import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditCustomerInfo({ customer, setCustomer }) {

    function formatDate(date) {
        if (!date) return "";
        return date.split("T")[0];  
    }

    return (
        <div className="grid grid-cols-1 gap-6 mb-10">

             {/* NAME */}
                <div>
                    <label className="block font-semibold text-[#2C3E50] mb-2">Customer Name<span className="text-red-500">*</span></label>
                    <input
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    />
                </div>

            {/* Name + Phone + Dates */}
            <div className="grid grid-cols-2 gap-6">

                {/* PHONE */}
                <div>
                    <label className="block font-semibold text-[#2C3E50] mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input
                       className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2
                        ${
                            customer.phoneNumber.length === 0 ||
                            customer.phoneNumber.length === 10
                            ? "border-gray-300 focus:ring-blue-500"
                            : "border-red-500 focus:ring-red-500"
                        }`}
                        type="tel"
                        minLength={10}
                        value={customer.phoneNumber || ""}
                        onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setCustomer({ ...customer, phoneNumber: value });
                        }}
                        
                    />
                    {customer.phoneNumber.length > 0 &&
                        customer.phoneNumber.length !== 10 && (
                        <p className="text-red-500 text-sm mt-1">
                            Phone number must be exactly 10 digits
                        </p>
                    )}
                </div>

                {/* EMAIL */}
                <div>
                    <label className="block font-semibold text-[#2C3E50] mb-2">Customer Email</label>
                    <input
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    />
                </div>

                {/* JOB DATE */}
                <div>
                    <label className="block font-semibold text-[#2C3E50] mb-2">Job Date</label>
                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formatDate(customer.jobDate)}
                        onChange={(e) =>
                            setCustomer({ ...customer, jobDate: e.target.value })
                        }
                    />
                </div>

                {/* NEED DATE */}
                <div>
                    <label className="block font-semibold text-[#2C3E50] mb-2">Need Date</label>
                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formatDate(customer.needDate)}
                        onChange={(e) =>
                            setCustomer({ ...customer, needDate: e.target.value })
                        }
                    />
                </div>
            </div>
        </div>
    );
}
