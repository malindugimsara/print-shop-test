import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import mediaUpload from "../utils/mediaupload";


export default function AddOrder() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [details, setDetails] = useState("");
    const [needDate, setNeedDate] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);
    const [images, setImages] = useState([]);

    const navigate = useNavigate();

    // 1️⃣ If user NOT logged in → show login message
    if (!localStorage.getItem("token")) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="bg-white shadow-2xl rounded-lg p-15 flex flex-col items-center gap-8 max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800">Login Required</h2>
                    <p className="text-gray-600 text-center text-sm">
                        You need to login to create order.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200"
                    >
                        Go to Login
                    </button>
                    
                </div>
            </div>
        );
    }

    useEffect(() => {
        loadUserDataFromToken();
    }, []);

    // ---------------------------
    //  Load user data from token
    // ---------------------------
    const loadUserDataFromToken = () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const decoded = jwtDecode(token);

            setName(decoded.name || "");
            setEmail(decoded.email || "");
            setPhoneNumber(decoded.phoneNumber || "");

        } catch (error) {
            console.error("Token decode error:", error);
        }
    };

    // ---------------------------
    //  Add New Job
    // ---------------------------
    async function handleAddJob() {
        
        const promisesArray=[]
        for (let i = 0; i < images.length; i++) {
            const promise = mediaUpload(images[i]);
            promisesArray[i] = promise;
        }

        try {
            setShowSpinner(true);

            const imageUrls = await Promise.all(promisesArray);

            if (!name || !email || !phoneNumber || !details || !needDate) {
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
                status: "Pending", // always pending
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
            navigate("/myorder", { replace: true });
        } catch (error) {
            setShowSpinner(false);
            toast.error(error.response?.data?.message || "Failed to add job.");
            console.error("Error adding job:", error);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 pt-20 pb-5">
            <div className="w-full max-w-lg shadow-2xl rounded-2xl flex flex-col items-center bg-white p-8">

                <h1 className="text-4xl font-extrabold text-[#2C3E50] mb-8 drop-shadow-lg">Add Order</h1>

                {/* Name */}
                <label className="w-full text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                    value={name}
                    readOnly
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-100 cursor-not-allowed"
                    placeholder="Name"
                    type="text"
                />

                {/* Email */}
                <label className="w-full text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                    value={email}
                    readOnly
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-100 cursor-not-allowed"
                    placeholder="Email"
                    type="email"
                />

                {/* Phone Number */}
                <label className="w-full text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-white"
                    type="number"
                    placeholder="Phone Number"
                />

                {/* Details */}
                <label className="w-full text-sm font-medium text-gray-700 mb-2">Details</label>
                <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full h-20 border border-gray-300 rounded-lg px-4 py-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Details"
                />

                {/* Need Date */}
                <label className="w-full text-sm font-medium text-gray-700 mb-2">Need Date</label>
                <input
                    type="date"
                    value={needDate}
                    onChange={(e) => setNeedDate(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                
                {/* Images */}
                <label className="w-full text-sm font-medium text-gray-700 mb-2">Images</label>
                <input
                    type="file"
                    multiple
                    onChange={(e) => setImages(Array.from(e.target.files))}
                    className="w-full border rounded-lg px-4 py-2 mb-4"
                />

                {/* Submit */}
                <button
                    onClick={handleAddJob}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg mb-4 shadow-md"
                    disabled={showSpinner}
                >
                    {showSpinner ? "Adding..." : "Add Order"}
                </button>

                {/* Cancel */}
                <Link
                    to={"/home"}
                    className="w-full h-12 bg-gray-400 hover:bg-gray-500 text-[#1E1E1E] font-semibold rounded-lg flex items-center justify-center shadow-md"
                >
                    Cancel
                </Link>

            </div>
        </div>
    );
}
