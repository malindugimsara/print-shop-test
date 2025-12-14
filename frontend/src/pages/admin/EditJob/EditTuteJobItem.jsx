import React, { useState, useEffect } from "react";

export default function EditTuteJobItem({ jobData, setJobData, status, setStatus }) {
    const [newCover, setNewCover] = useState("");
    const [newInner, setNewInner] = useState("");
    const [showCoverInput, setShowCoverInput] = useState(false);
    const [showInnerInput, setShowInnerInput] = useState(false);

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

    const [innerItems, setInnerItems] = useState([
        "Duplo - 70gsm A3",
        "Duplo - 60gsm A3",
        "Duplo - 70gsm A4",
        "Duplo - 60gsm A4",
        "Photocopy - 70gsm A3",
        "Photocopy - 70gsm A4",
    ]);

    // When jobData loads → prefill fields
    useEffect(() => {
        if (!jobData) return;

        // If custom cover/inner exists but not in list → add it
        if (jobData.cover && !coverItems.includes(jobData.cover)) {
            setCoverItems((prev) => [...prev, jobData.cover]);
        }
        if (jobData.innerPage && !innerItems.includes(jobData.innerPage)) {
            setInnerItems((prev) => [...prev, jobData.innerPage]);
        }
    }, [jobData]);

    const handleChange = (field, value) => {
        setJobData({
            ...jobData,
            [field]: value,
        });
    };

    const handleStatusChange = (value) => {
        setStatus(value);
    };

    const addCoverItem = () => {
        if (!newCover.trim()) return;
        setCoverItems([...coverItems, newCover]);
        setNewCover("");
        setShowCoverInput(false);
    };

    const addInnerItem = () => {
        if (!newInner.trim()) return;
        setInnerItems([...innerItems, newInner]);
        setNewInner("");
        setShowInnerInput(false);
    };

    return (
        <div className="mt-10 bg-white rounded-xl shadow-md p-6 border border-gray-200">

            {/* TITLE */}
            <div className="p-4 bg-[#F8F9FA] border border-gray-300 rounded-xl mb-6 flex justify-center items-center">
                <h1 className="text-2xl font-bold text-[#2C3E50]">Tute</h1>
            </div>

            {/* TOP SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F8F9FA] p-6 rounded-xl border">

                {/* Tute Type */}
                <div>
                    <label className="block font-semibold mb-2 text-[#2C3E50]">Tute Type</label>
                    <div className="space-y-2">
                        {["Duplo", "Photocopy"].map((t) => (
                            <label key={t} className="flex items-center">
                                <input
                                    type="radio"
                                    name="tuteType"
                                    className="mr-2"
                                    checked={jobData.tuteType === t}
                                    onChange={() => handleChange("tuteType", t)}
                                />
                                {t}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Size */}
                <div>
                    <label className="block font-semibold mb-2 text-[#2C3E50]">Size</label>
                    <div className="space-y-2">
                        {["A3", "A4", "Other"].map((s) => (
                            <label key={s} className="flex items-center">
                                <input
                                    type="radio"
                                    name="size"
                                    className="mr-2"
                                    checked={jobData.size === s}
                                    onChange={() => handleChange("size", s)}
                                />
                                {s}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Finishing */}
                <div>
                    <label className="block font-semibold mb-2 text-[#2C3E50]">Finishing</label>
                    <div className="space-y-2">
                        {["Center Pin", "Side Pin", "Binding"].map((opt) => (
                            <label key={opt} className="flex items-center">
                                <input
                                    type="radio"
                                    name="finishing"
                                    className="mr-2"
                                    checked={jobData.finishing === opt}
                                    onChange={() => handleChange("finishing", opt)}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quantity + Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F9FA] p-6 rounded-xl border mt-6">

                <div>
                    <label className="font-semibold text-[#2C3E50]">Quantity</label>
                    <input
                        type="number"
                        className="w-full mt-2 p-2 border rounded-lg"
                        value={jobData.quantity || ""}
                        onChange={(e) => handleChange("quantity", e.target.value)}
                    />
                </div>

                <div>
                    <label className="font-semibold text-[#2C3E50]">Title</label>
                    <input
                        type="text"
                        className="w-full mt-2 p-2 border rounded-lg"
                        value={jobData.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                    />
                </div>
            </div>

            {/* Cover + Inner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                {/* COVER */}
                <div className="p-5 border rounded-xl">
                    <h2 className="text-lg font-bold text-[#D16BA5] mb-3">📄 Cover</h2>

                    <div className="space-y-2 max-h-56 overflow-y-auto">
                        {coverItems.map((item, idx) => (
                            <label key={idx} className="flex items-center">
                                <input
                                    type="radio"
                                    name="cover"
                                    className="mr-2"
                                    checked={jobData.cover === item}
                                    onChange={() => handleChange("cover", item)}
                                />
                                {item}
                            </label>
                        ))}
                    </div>

                    {showCoverInput && (
                        <div className="flex mt-3 gap-2">
                            <input
                                value={newCover}
                                onChange={(e) => setNewCover(e.target.value)}
                                className="flex-1 p-2 border rounded"
                                placeholder="Add new cover..."
                            />
                            <button onClick={addCoverItem} className="px-4 py-2 text-white bg-[#48CAE4] rounded">
                                Add
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => setShowCoverInput(!showCoverInput)}
                        className="mt-4 w-full py-2 bg-[#48CAE4] text-white rounded"
                    >
                        + Add Item
                    </button>
                </div>

                {/* INNER */}
                <div className="p-5 border rounded-xl">
                    <h2 className="text-lg font-bold text-[#D16BA5] mb-3">📑 Inner Pages</h2>

                    <div className="space-y-2 max-h-56 overflow-y-auto">
                        {innerItems.map((item, idx) => (
                            <label key={idx} className="flex items-center">
                                <input
                                    type="radio"
                                    name="innerPage"
                                    className="mr-2"
                                    checked={jobData.innerPage === item}
                                    onChange={() => handleChange("innerPage", item)}
                                />
                                {item}
                            </label>
                        ))}
                    </div>

                    {showInnerInput && (
                        <div className="flex mt-3 gap-2">
                            <input
                                value={newInner}
                                onChange={(e) => setNewInner(e.target.value)}
                                className="flex-1 p-2 border rounded"
                                placeholder="Add new inner page..."
                            />
                            <button onClick={addInnerItem} className="px-4 py-2 text-white bg-[#48CAE4] rounded">
                                Add
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => setShowInnerInput(!showInnerInput)}
                        className="mt-4 w-full py-2 bg-[#48CAE4] text-white rounded"
                    >
                        + Add Item
                    </button>
                </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6 p-5 border rounded-xl bg-[#F8F9FA]">
                <h2 className="font-bold text-lg text-[#D16BA5] mb-2">📝 Job Description</h2>
                <textarea
                    rows="5"
                    className="w-full p-3 border rounded-lg"
                    value={jobData.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                ></textarea>
            </div>

            {/* STATUS */}
            <div className="p-5 rounded-xl border bg-gray-50 hover:border-[#48CAE4] transition">
                <label className="block font-semibold text-[#2C3E50] mb-3">Status</label>

                <div className="flex gap-2">
                    {["Pending", "In Progress", "Completed"].map((s) => (
                        <label key={s} className="flex items-center cursor-pointer p-2 rounded hover:bg-blue-50">
                            <input
                                type="radio"
                                name="jobStatus"
                                className="mr-2"
                                checked={status === s}
                                onChange={() => handleStatusChange(s)}
                            />
                            <span>{s}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
