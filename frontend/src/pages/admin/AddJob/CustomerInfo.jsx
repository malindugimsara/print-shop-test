import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function CustomerInfo({ customer, setCustomer }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef(null);

  // ===============================
  // 🔍 AUTOFILL + DROPDOWN BY NAME
  // ===============================
  useEffect(() => {
    if (!customer.name || customer.name.length < 1) {
      setSuggestions([]);
      return;
    }

    clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/customer/name/${customer.name}`
        );

        if (Array.isArray(res.data)) {
          setSuggestions(res.data);
          setShowDropdown(true);
        }
      } catch {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(searchTimeout.current);
  }, [customer.name]);

  // ===============================
  // ✅ SELECT CUSTOMER FROM LIST
  // ===============================
  function selectCustomer(cust) {
    setCustomer(prev => ({
      ...prev,
      name: cust.name,
      email: cust.email || "",
      phoneNumber: cust.phoneNumber || "",
    }));

    setSuggestions([]);
    setShowDropdown(false);
  }

  // ===============================
  // ➕ ADD CUSTOMER
  // ===============================
  async function handleAddCustomer() {
    try {
      if (!customer.name || !customer.phoneNumber) {
        toast.error("Please fill all required fields");
        return;
      }

      try {
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/customer/phoneNumber/${customer.phoneNumber}`
        );
        toast.error("Customer already exists");
        return;
      } catch {}

      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/customer`,
        customer,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Customer added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add customer");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 mb-10">

      {/* NAME WITH DROPDOWN */}
      <div className="relative">
        <label className="block font-semibold mb-2">Customer Name <span className="text-red-500">*</span> </label>
        <input
          className="w-full border p-3 rounded-lg"
          value={customer.name}
          onChange={e =>
            setCustomer({ ...customer, name: e.target.value })
          }
          onFocus={() => setShowDropdown(true)}
        />

        {/* DROPDOWN */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute z-20 bg-white border rounded-lg w-full mt-1 shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map(cust => (
              <div
                key={cust._id}
                onClick={() => selectCustomer(cust)}
                className="p-3 hover:bg-gray-100 cursor-pointer"
              >
                <p className="font-medium">{cust.name}</p>
                <p className="text-sm text-gray-500">
                  {cust.email} • {cust.phoneNumber}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PHONE + EMAIL */}
      <div className="grid grid-cols-2 gap-6">
        <div>
            <label className="block font-semibold text-[#2C3E50] mb-2">
                Phone Number <span className="text-red-500">*</span>
            </label>

            <input
                type="tel"
                minLength={10}
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2
                ${
                    customer.phoneNumber.length === 0 ||
                    customer.phoneNumber.length === 10
                    ? "border-gray-300 focus:ring-blue-500"
                    : "border-red-500 focus:ring-red-500"
                }`}
                value={customer.phoneNumber}
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

        <div>
          <label className="block font-semibold mb-2">Customer Email</label>
          <input
            className="w-full border p-3 rounded-lg"
            value={customer.email || ""}
            onChange={e =>
              setCustomer({ ...customer, email: e.target.value })
            }
          />
        </div>
      </div>

      {/* ADD CUSTOMER BUTTON */}
      <div className="flex justify-center">
        <button
          onClick={handleAddCustomer}
          className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-xl shadow border border-black font-semibold transition-colors duration-300"
        >
          + Add New Customer
        </button>
      </div>

      {/* JOB + NEED DATE */}
      <div className="grid grid-cols-2 gap-6">
        <input
          type="date"
          className="border p-3 rounded-lg"
          value={customer.jobDate || ""}
          onChange={e =>
            setCustomer({ ...customer, jobDate: e.target.value })
          }
        />
        <input
          type="date"
          className="border p-3 rounded-lg"
          value={customer.needDate || ""}
          onChange={e =>
            setCustomer({ ...customer, needDate: e.target.value })
          }
        />
      </div>
    </div>
  );
}
