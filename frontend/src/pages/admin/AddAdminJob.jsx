import React, { useState } from "react";
import JobHeader from "./AddJob/JobHeader";
import CustomerInfo from "./AddJob/CustomerInfo";
import AddJobActions from "./AddJob/AddJobActions";
import TuteJobItem from "./AddJob/TuteJobItem";
import CoverPageJobItem from "./AddJob/CoverPageJobItem";
import OtherJobItem from "./AddJob/OtherJobItem";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddAdminJob() {

 
  // CUSTOMER DETAILS
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    jobDate: "",
    needDate: "",
  });

  
  // MULTIPLE ITEMS STATE
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  // ADD NEW ITEM
  
  const addItem = (type) => {
    const newItem = {
      type,
      data: {},
      status: "Pending",
    };

    setItems([...items, newItem]);
    setActiveIndex(items.length); // open newly added item
  };
  const navigate = useNavigate();

  
  // UPDATE ITEM DATA
  
  const updateItemData = (index, newData) => {
    const copy = [...items];
    copy[index].data = newData;
    setItems(copy);
  };

  
  // UPDATE ITEM STATUS
  const updateItemStatus = (index, newStatus) => {
    const copy = [...items];
    copy[index].status = newStatus;
    setItems(copy);
  };

  // SUBMIT JOB
  const submitJob = async () => {
    if (!customer.name || !customer.phoneNumber) {
      toast.error("Please fill all customer details");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one job item.");
      return;
    }

    const payload = {
      ...customer,
      items,
    };

    try {
      setShowSpinner(true);

      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/job",
        payload
      );

      toast.success("Job submitted successfully!");
      navigate("/admin/viewjob")
      setShowSpinner(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit job");
      setShowSpinner(false);
    }
  };

  // DELETE ITEM
    const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);

    setItems(newItems);

    // Fix activeIndex
    if (activeIndex === index) {
        setActiveIndex(null); // close if deleted tab is active
    } else if (activeIndex > index) {
        setActiveIndex(activeIndex - 1); // shift active index if above deleted
    }
    };


  return (
    <div className="min-h-screen bg-[#F8F9FA] py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-200">

        {/* Page Top Header */}
        <JobHeader />

        {/* Customer Section */}
        <CustomerInfo customer={customer} setCustomer={setCustomer} />

        
        {/* RENDER ITEM LIST (TABS) */}
        {items.length > 0 && (
          <div className="mt-6 mb-4 flex gap-3 flex-wrap">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <button
                  onClick={() => setActiveIndex(index)}
                  className={`px-4 py-2 rounded-lg shadow 
                    ${activeIndex === index ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  {item.type.toUpperCase()} #{index + 1}
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => deleteItem(index)}
                  className="w-8 h-8 bg-red-500 text-white rounded-4xl hover:bg-red-600"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        {/* RENDER ACTIVE ITEM FORM */}
        <div className="mt-6">
          {activeIndex !== null && (
            <>
              {items[activeIndex].type === "tute" && (
                <TuteJobItem
                  jobData={items[activeIndex].data}
                  setJobData={(data) => updateItemData(activeIndex, data)}
                  status={items[activeIndex].status}
                  setStatus={(s) => updateItemStatus(activeIndex, s)}
                />
              )}

              {items[activeIndex].type === "cover" && (
                <CoverPageJobItem
                  jobData={items[activeIndex].data}
                  setJobData={(data) => updateItemData(activeIndex, data)}
                  status={items[activeIndex].status}
                  setStatus={(s) => updateItemStatus(activeIndex, s)}
                />
              )}

              {items[activeIndex].type === "other" && (
                <OtherJobItem
                  jobData={items[activeIndex].data}
                  setJobData={(data) => updateItemData(activeIndex, data)}
                  status={items[activeIndex].status}
                  setStatus={(s) => updateItemStatus(activeIndex, s)}
                />
              )}
            </>
          )}
        </div>

        {/* ACTION BUTTONS (Add Item + Submit) */}
        <AddJobActions
          addItem={addItem}
          submitJob={submitJob}
          showSpinner={showSpinner}
        />

      </div>
    </div>
  );
}
