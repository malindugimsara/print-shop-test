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

            {/* Name + Phone + Dates */}
            <div className="grid grid-cols-2 gap-6">

                {/* NAME */}
                <div>
                    <label className="block font-semibold text-[#2C3E50] mb-2">Customer Name</label>
                    <input
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    />
                </div>

                {/* PHONE */}
                <div>
                    <label className="block font-semibold text-[#2C3E50] mb-2">Phone Number</label>
                    <input
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="tel"
                        value={customer.phoneNumber || ""}
                        onChange={(e) =>
                            setCustomer({ ...customer, phoneNumber: e.target.value })
                        }
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
