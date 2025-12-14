import React, { useEffect, useState } from "react";

export default function EditCoverPageJobItem({ jobData, setJobData, status, setStatus }) {
    
    const [newCover, setNewCover] = useState("");
    const [showCoverInput, setShowCoverInput] = useState(false);

    const [coverItems, setCoverItems] = useState([
        "bank paper 70gsm",
        "bank paper 100gsm",
        "one colour bank paper 70gsm",
        "Two colour bank paper 70gsm",
        "design paper 70gsm",
        "photo paper glossy 135gsm",
        "photo paper matte 128gsm",
        "photo board matte 230gsm",
        "photo board glossy 230gsm",
        "Bristol board",
        "Ivory Board",
    ]);

    // Prefill values when loading jobData
    useEffect(() => {
        if (!jobData) return;

        // Add custom cover item if needed
        if (jobData.cover && !coverItems.includes(jobData.cover)) {
            setCoverItems(prev => [...prev, jobData.cover]);
        }
    }, [jobData]);

    // Update parent job object
    const handleChange = (field, value) => {
        setJobData({
            ...jobData,
            [field]: value,
        });
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
    };

    const addCoverItem = () => {
        if (!newCover.trim()) return;

        setCoverItems([...coverItems, newCover]);
        setNewCover("");
        setShowCoverInput(false);
    };
  
    return (
        <div className="p-6 bg-white rounded-xl shadow-md border">

            {/* Title */}
            <div className="text-center mb-6 bg-gray-100 p-4 rounded-xl border">
                <h1 className="text-2xl font-bold text-[#2C3E50]">Cover Page</h1>
            </div>

            {/* Size + Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border">

                {/* Size */}
                <div>
                    <label className="font-semibold mb-2 block">Size</label>
                    <div className="space-y-2">
                        {["A3", "A4", "Other"].map((s) => (
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
                    <label className="font-semibold mb-2 block">Quantity</label>
                    <input
                        type="number"
                        className="w-full p-2 border rounded-lg"
                        value={jobData.quantity || ""}
                        onChange={(e) => handleChange("quantity", e.target.value)}
                    />
                </div>
            </div>

            {/* Title */}
            <div className="mt-6 bg-gray-50 p-6 rounded-xl border">
                <label className="font-semibold mb-2 block">Title</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={jobData.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                />
            </div>

            {/* Cover Selection */}
            <div className="mt-6 p-5 border rounded-xl bg-gray-50">
                <h2 className="font-bold mb-4 text-[#D16BA5]">📄 Cover Type</h2>

                <div className="max-h-56 overflow-y-auto space-y-2">
                    {coverItems.map((opt, idx) => (
                        <label key={idx} className="flex items-center">
                            <input
                                type="radio"
                                name="cover"
                                checked={jobData.cover === opt}
                                onChange={() => handleChange("cover", opt)}
                                className="mr-2"
                            />
                            {opt}
                        </label>
                    ))}
                </div>

                {showCoverInput && (
                    <div className="flex gap-2 mt-3">
                        <input
                            type="text"
                            value={newCover}
                            onChange={(e) => setNewCover(e.target.value)}
                            className="flex-1 p-2 border rounded"
                            placeholder="Enter custom cover..."
                        />
                        <button
                            onClick={addCoverItem}
                            className="px-4 py-2 bg-[#48CAE4] text-white rounded"
                        >
                            Add
                        </button>
                    </div>
                )}

                <button
                    onClick={() => setShowCoverInput(!showCoverInput)}
                    className="mt-4 p-2 bg-[#48CAE4] text-white rounded"
                >
                    + Add Item
                </button>
            </div>

            {/* Description */}
            <div className="mt-6 p-5 border rounded-xl bg-gray-50">
                <h2 className="font-bold mb-2 text-[#D16BA5]">📝 Description</h2>
                <textarea
                    rows="5"
                    className="w-full p-3 border rounded-lg"
                    value={jobData.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                ></textarea>
            </div>

            {/* Status */}
            <div className="mt-6 p-5 border rounded-xl bg-gray-50">
                <label className="block font-semibold mb-3">Status</label>

                <div className="flex gap-3">
                    {["Pending", "In Progress", "Completed"].map((s) => (
                        <label key={s} className="flex items-center">
                            <input
                                type="radio"
                                name="status"
                                checked={status === s}
                                onChange={() => handleStatusChange(s)}
                                className="mr-2"
                            />
                            {s}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
