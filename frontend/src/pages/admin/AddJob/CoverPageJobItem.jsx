import React, { useState } from "react";

export default function CoverPageJobItem({ jobData, setJobData, status, setStatus }) {
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

    // 🔥 Update backend-compatible structure
    const handleChange = (field, value) => {
        setJobData({
            ...jobData,
            [field]: value,     // <— IMPORTANT
        });
    };

    const handleStatusChange = (value) => {
        setStatus(value);
    };

    const addCoverItem = () => {
        if (newCover.trim() === "") return;
        setCoverItems([...coverItems, newCover]);
        setNewCover("");
        setShowCoverInput(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8EAED]">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

                {/* Header */}
                <div className="p-6 flex items-center justify-center border border-gray-300 m-2 rounded-xl bg-[#F8F9FA]">
                    <h1 className="text-2xl font-bold text-black">Cover Page</h1>
                </div>

                <div className="p-6 space-y-6">

                    {/* Size + Quantity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F9FA] p-6 rounded-xl border border-gray-200">

                        {/* Size */}
                        <div>
                            <label className="block font-semibold text-[#2C3E50] mb-3">Size</label>
                            <div className="flex gap-2">
                                {["A3", "A4", "Other"].map((s) => (
                                    <label key={s} className="flex items-center cursor-pointer p-2 rounded hover:bg-blue-50 transition">
                                        <input
                                            type="radio"
                                            name="size"
                                            className="mr-2 cursor-pointer w-4 h-4"
                                            onChange={() => handleChange("size", s)}
                                        />
                                        <span className="text-sm text-[#2C3E50]">{s}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block font-semibold text-[#2C3E50] mb-3">Quantity</label>
                            <input
                                type="number"
                                className="w-full bg-white text-[#2C3E50] px-3 py-2 rounded-lg border border-gray-300 focus:border-[#48CAE4] focus:outline-none transition"
                                placeholder="Enter qty"
                                onChange={(e) => handleChange("quantity", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="grid grid-cols-1 gap-4 bg-[#F8F9FA] p-6 rounded-xl border border-gray-200">
                        <div>
                            <label className="block font-semibold text-[#2C3E50] mb-3">Title</label>
                            <input
                                type="text"
                                className="w-full bg-white text-[#2C3E50] px-3 py-2 border border-gray-300 rounded-lg focus:border-[#48CAE4] focus:outline-none transition"
                                placeholder="Enter job title"
                                onChange={(e) => handleChange("title", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Cover Options */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="p-5 rounded-xl border border-gray-200 bg-gray-50 hover:border-[#48CAE4] transition">
                            <h2 className="font-bold text-lg mb-4 text-[#D16BA5]">📄 Cover Type</h2>

                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {coverItems.map((opt, index) => (
                                    <label key={index} className="flex items-center cursor-pointer p-2 rounded hover:bg-blue-50 transition">
                                        <input
                                            type="radio"
                                            name="cover"
                                            className="mr-3 cursor-pointer w-4 h-4"
                                            onChange={() => handleChange("cover", opt)}
                                        />
                                        <span className="text-sm text-[#2C3E50]">{opt}</span>
                                    </label>
                                ))}
                            </div>

                            {showCoverInput && (
                                <div className="flex gap-2 mt-4">
                                    <input
                                        type="text"
                                        value={newCover}
                                        onChange={(e) => setNewCover(e.target.value)}
                                        placeholder="Enter custom item..."
                                        className="flex-1 bg-white text-[#2C3E50] px-3 py-2 rounded-lg border border-gray-300 focus:border-[#48CAE4] focus:outline-none"
                                    />
                                    <button
                                        onClick={addCoverItem}
                                        className="bg-[#48CAE4] hover:bg-[#38bada] text-white px-4 py-2 rounded-lg font-semibold transition"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() => setShowCoverInput(!showCoverInput)}
                                className="mt-4 max-w-50 bg-[#48CAE4] hover:bg-[#38bada] text-white px-4 py-2 rounded-lg font-semibold transition"
                            >
                                + Add Item
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-5 rounded-xl border border-gray-200 bg-gray-50">
                        <h2 className="font-bold text-lg mb-3 text-[#D16BA5]">📝 Job Description</h2>

                        <textarea
                            rows="6"
                            className="w-full bg-white text-[#2C3E50] p-3 rounded-lg border border-gray-300 focus:border-[#48CAE4] focus:outline-none resize-none transition"
                            placeholder="Write job description..."
                            onChange={(e) => handleChange("description", e.target.value)}
                        ></textarea>
                    </div>

                    {/* Status */}
                    <div className="p-5 rounded-xl border border-gray-200 bg-gray-50 hover:border-[#48CAE4] transition">
                        <label className="block font-semibold text-[#2C3E50] mb-3">Status</label>
                        <div className="flex gap-2">
                            {["Pending", "In Progress", "Completed"].map((s) => (
                                <label key={s} className="flex items-center cursor-pointer p-2 rounded hover:bg-blue-50 transition">
                                    <input
                                        type="radio"
                                        name="size"
                                        className="mr-2 cursor-pointer w-4 h-4"
                                        onChange={() => handleStatusChange(s)}
                                    />
                                    <span className="text-sm text-[#2C3E50]">{s}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
