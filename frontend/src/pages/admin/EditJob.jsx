import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import EditJobHeader from "./EditJob/EditJobHeader";
import EditCustomerInfo from "./EditJob/EditCustomerInfo";
import EditTuteJobItem from "./EditJob/EditTuteJobItem";
import EditCoverPageJobItem from "./EditJob/EditCoverPageJobItem";
import EditOtherJobItem from "./EditJob/EditOtherJobItem";
import EditJobActions from "./EditJob/EditJobActions";

export default function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
 
 
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
  const [loading, setLoading] = useState(true);

 
  // FETCH JOB DATA
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/job/${jobId}`,
            {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") },
            }
        );

        const job = res.data;
        setCustomer({
          name: job.name,
          email: job.email,
          phoneNumber: job.phoneNumber,
          jobDate: job.jobDate,
          needDate: job.needDate,
        });

        setItems(job.items || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load job data");
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  
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

  
  // SUBMIT JOB UPDATE
  const updateJob = async () => {
    if (!customer.name || !customer.email || !customer.phoneNumber) {
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

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/job/${jobId}`,
        payload,
        {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        }
      );

      toast.success("Job updated successfully!");
      navigate("/admin/viewjob");
      setShowSpinner(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update job");
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


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-200">

        {/* Page Top Header */}
        <EditJobHeader />

        {/* Customer Section */}
        <EditCustomerInfo customer={customer} setCustomer={setCustomer} />

        
        {/* RENDER ITEM LIST (TABS) */}
        {items.length > 0 && (
        <div className="mt-6 mb-4 flex gap-3 flex-wrap">
            {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
                
                {/* Select Tab */}
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
                <EditTuteJobItem
                  jobData={items[activeIndex].data}
                  setJobData={(data) => updateItemData(activeIndex, data)}
                  status={items[activeIndex].status}
                  setStatus={(s) => updateItemStatus(activeIndex, s)}
                />
              )}

              {items[activeIndex].type === "cover" && (
                <EditCoverPageJobItem
                  jobData={items[activeIndex].data}
                  setJobData={(data) => updateItemData(activeIndex, data)}
                  status={items[activeIndex].status}
                  setStatus={(s) => updateItemStatus(activeIndex, s)}
                />
              )}

              {items[activeIndex].type === "other" && (
                <EditOtherJobItem
                  jobData={items[activeIndex].data}
                  setJobData={(data) => updateItemData(activeIndex, data)}
                  status={items[activeIndex].status}
                  setStatus={(s) => updateItemStatus(activeIndex, s)}
                />
              )}
            </>
          )}
        </div>

        {/* ACTION BUTTONS (Add Item + Update) */}
        <EditJobActions
          addItem={addItem}
          submitJob={updateJob}
          showSpinner={showSpinner}
        />

      </div>
    </div>
  );
}
