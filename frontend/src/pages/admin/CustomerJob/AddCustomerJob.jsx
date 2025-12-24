import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaupload";

export default function AddCustomerJob() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [details, setDetails] = useState("");
    const [needDate, setNeedDate] = useState("");
    const [status, setStatus] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);
    const [images, setImages] = useState([]);

    const navigate = useNavigate();
    async function handleAddJob() {

        const promisesArray = [];
        for (let i = 0; i < images.length; i++) {
            const promise = mediaUpload(images[i]);
            promisesArray[i] = promise;
        }

        try {
            setShowSpinner(true);
            const imageUrls = await Promise.all(promisesArray);

            if (!name || !email || !phoneNumber || !details || !needDate || !status) {
                toast.error("Please fill in all required fields.");
                setShowSpinner(false);
                return;
            }

            const job = {
                name,
                email,
                phoneNumber,
                details,
                needDate,
                status,
                images: imageUrls
            };

            const token = localStorage.getItem("token");

            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/jobcustomer",
                job,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Job added successfully!");
            setShowSpinner(false);
            navigate("/admin/jobcustomer", { replace: true });
        } catch (error) {
            setShowSpinner(false);
            toast.error(error.response?.data?.message || "Failed to add job.");
            console.error("Error adding job:", error);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            
            <div className="w-full max-w-lg shadow-2xl rounded-2xl flex flex-col items-center bg-white p-8">
                <h1 className="text-4xl font-extrabold text-[#2C3E50] mb-8 drop-shadow-lg">Add Job</h1>

                {/* Email (trigger autofill) */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"
                    placeholder="Email"
                    type="email"
                />

                {/* Name */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"
                    placeholder="Name"
                    type="text"
                />

                {/* Phone Number */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"
                    placeholder="Phone Number"
                    type="text"
                />

                {/* Details */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Details</label>
                <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full h-20 border border-gray-300 rounded-lg px-4 py-2 mb-4 resize-none"
                    placeholder="Details"
                />

                {/* Need Date */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Need Date</label>
                <input
                    value={needDate}
                    onChange={(e) => setNeedDate(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"
                    type="date"
                />

                {/* Images */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Images</label>
                <input
                    type="file"
                    multiple
                    onChange={(e) => setImages(Array.from(e.target.files))}
                    className="w-full border rounded-lg px-4 py-2 mb-4"
                />

                {/* Status */}
                <label className="w-full text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-6"
                >
                    <option value="" disabled>Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>

                <button
                    onClick={handleAddJob}
                    className="w-full h-12 bg-blue-600 text-white rounded-lg mb-4"
                    disabled={showSpinner}
                >
                    {showSpinner ? "Adding..." : "Add Job"}
                </button>

                <Link to={"/admin/addjob"} className="w-full h-12 bg-gray-400 text-center pt-3 rounded-lg">
                    Cancel
                </Link>
            </div>
        </div>
    );
}
