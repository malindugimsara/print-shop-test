import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import mediaUpload from "../utils/mediaupload";

export default function EditOrder() {
    const locationData = useLocation();
    const navigate = useNavigate();

    if (!locationData.state) {
        toast.error("No job data found.");
        window.location.href = "/myorder";
    }

    const jobData = locationData.state;

    const [jobID] = useState(jobData.jobID); // Disabled: not editable
    const [name, setName] = useState(jobData.name);
    const [email, setEmail] = useState(jobData.email);
    const [phoneNumber, setPhoneNumber] = useState(jobData.phoneNumber);
    const [details, setDetails] = useState(jobData.details);
    const [needDate, setNeedDate] = useState(jobData.needDate);

    // ⭐ Correct images handling
    const [existingImages, setExistingImages] = useState(jobData.images || []);
    const [newImages, setNewImages] = useState([]);

    const [showSpinner, setShowSpinner] = useState(false);

    // ⭐ Delete old images
    function handleDeleteImage(index) {
        const updated = [...existingImages];
        updated.splice(index, 1);
        setExistingImages(updated);
    }

    // ⭐ Submit update
    async function handleEditJob() {
        try {
            setShowSpinner(true);

            // Upload only new image files
            let uploadedImageUrls = [];

            if (newImages.length > 0) {
                const uploadPromises = newImages.map((file) => mediaUpload(file));
                uploadedImageUrls = await Promise.all(uploadPromises);
            }

            // Final images = old (remaining) + new uploaded
            const finalImages = [...existingImages, ...uploadedImageUrls];

            const updatedJob = {
                phoneNumber,
                details,
                needDate,
                images: finalImages,
            };

            const token = localStorage.getItem("token");

            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/jobcustomer/${jobID}`,
                updatedJob,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            toast.success("Job updated successfully!");
            navigate("/myorder");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update job.");
        } finally {
            setShowSpinner(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 p-5 pt-20">
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 flex flex-col items-center">

                <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
                    Edit Job
                </h1>

                <form className="w-full flex flex-col gap-4">

                    {/* Job ID */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Job ID</label>
                        <input
                            disabled
                            value={jobID}
                            className="w-full h-12 border bg-gray-200 rounded-lg px-4 text-gray-500 font-semibold"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                        <input
                            disabled
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-12 border border-gray-300 rounded-lg px-4"
                            type="text"
                            placeholder="Name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                            disabled
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 border border-gray-300 rounded-lg px-4"
                            type="email"
                            placeholder="Email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                            disabled
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full h-12 border border-gray-300 rounded-lg px-4"
                            type="number"
                            placeholder="Phone Number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Details</label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full h-20 border border-gray-300 rounded-lg px-4 py-2"
                            placeholder="Details"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Need Date</label>
                        <input
                            value={needDate}
                            onChange={(e) => setNeedDate(e.target.value)}
                            type="date"
                            className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:outline-none"
                        />
                    </div>

                    {/* ⭐ Old images preview */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Images</label>
                        <div className="w-full flex flex-wrap gap-4 mb-4">
                            {existingImages.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={img}
                                        className="w-24 h-24 object-cover rounded-lg border"
                                    />

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            {/* Preview new image files */}
                            {newImages.map((file, index) => (
                                <img
                                    key={"new-" + index}
                                    src={URL.createObjectURL(file)}
                                    className="w-24 h-24 object-cover rounded-lg border"
                                />
                            ))}
                        </div>
                    </div>

                    {/* ⭐ Upload new images */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Images</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) =>
                                setNewImages(Array.from(e.target.files))
                            }
                            className="w-full border rounded-lg px-4 py-2 mb-4"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleEditJob}
                        className="w-full h-12 bg-green-600 text-white rounded-lg"
                        disabled={showSpinner}
                    >
                        {showSpinner ? "Saving..." : "Save Changes"}
                    </button>

                    <Link
                        to="/myorder"
                        className="w-full h-12 bg-red-500 text-white rounded-lg flex items-center justify-center"
                    >
                        Cancel
                    </Link>

                </form>
            </div>
        </div>
    );
}
