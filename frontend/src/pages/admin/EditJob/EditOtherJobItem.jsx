import React, { useState, useEffect } from "react";

export default function EditOtherJobItem({
  jobData,
  setJobData,
  status,
  setStatus,
}) {
  // -------------------------------------
  // LOCAL FORM STATE (Fixes your problem)
  // -------------------------------------
  const [form, setForm] = useState({
    size: "",
    quantity: "",
    title: "",
    cover: "",
    description: "",
  });

  const [coverItems, setCoverItems] = useState([
    "Class card - ivory board",
    "Business card - Matte board",
    "Flyer",
  ]);

  const [newCover, setNewCover] = useState("");
  const [showCoverInput, setShowCoverInput] = useState(false);

  // -------------------------------------
  // LOAD EXISTING DATA FROM PARENT
  // -------------------------------------

  useEffect(() => {
        if (!jobData) return;

        if (jobData.cover && !coverItems.includes(jobData.cover)) {
            setCoverItems((prev) => [...prev, jobData.other]);
        }
    }, [jobData]);

  // -------------------------------------
  // UPDATE LOCAL + PARENT STATE
  // -------------------------------------
  const handleChange = (field, value) => {
    setJobData({
        ...jobData,
        [field]: value,
    });
  };

  const addCoverItem = () => {
    if (newCover.trim() === "") return;

    setCoverItems([...coverItems, newCover]);
    handleChange("cover", newCover);
    setNewCover("");
    setShowCoverInput(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8EAED]">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        
        <div className="p-6 flex items-center justify-center border border-gray-300 m-2 rounded-xl bg-[#F8F9FA]">
          <h1 className="text-2xl font-bold text-black">Other</h1>
        </div>

        <div className="p-6 space-y-6">

          {/* Size + Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F9FA] p-6 rounded-xl border border-gray-200">
            
            {/* Size */}
            <div>
              <label className="block font-semibold mb-3">Size</label>
              <div className="flex gap-4">
                {["A3", "A4", "A5", "Other"].map((s) => (
                  <label key={s} className="flex items-center">
                    <input
                      type="radio"
                      name="size"
                      checked={jobData.size === s}
                      onChange={() => handleChange("size", s)}
                      className="mr-2"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-semibold mb-3">Quantity</label>
              <input
                type="number"
                value={jobData.quantity}
                onChange={(e) => handleChange("quantity", Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          {/* Title */}
          <div className="bg-[#F8F9FA] p-6 rounded-xl border border-gray-200">
            <label className="block font-semibold mb-3">Title</label>
            <input
              type="text"
              value={jobData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Cover */}
          <div className="p-5 rounded-xl border bg-gray-50">
            <h2 className="font-bold text-lg mb-4">📄 Cover</h2>

            {coverItems.map((opt, idx) => (
              <label key={idx} className="flex items-center p-2">
                <input
                  type="radio"
                  name="cover"
                  checked={jobData.cover === opt}
                  onChange={() => handleChange("cover", opt)}
                  className="mr-3"
                />
                {opt}
              </label>
            ))}

            {showCoverInput && (
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={newCover}
                  onChange={(e) => setNewCover(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Enter custom cover"
                />
                <button
                  onClick={addCoverItem}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            )}

            <button
              onClick={() => setShowCoverInput(!showCoverInput)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              + Add Item
            </button>
          </div>

          {/* Description */}
          <div className="p-5 rounded-xl border bg-gray-50">
            <h2 className="font-bold text-lg mb-3">📝 Description</h2>
            <textarea
              rows="6"
              value={jobData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full p-3 border rounded"
            ></textarea>
          </div>

          {/* Status */}
          <div className="p-5 rounded-xl border bg-gray-50">
            <label className="block font-semibold mb-3">Status</label>
            <div className="flex gap-3">
              {["Pending", "In Progress", "Completed"].map((s) => (
                <label key={s} className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="mr-2"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
