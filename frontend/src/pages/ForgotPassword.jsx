import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const navigate = useNavigate();

    function sendEmail() {
        setShowSpinner(true);
        axios
            .post(import.meta.env.VITE_BACKEND_URL + "/api/user/sendMail", { email })
            .then(() => {
                setEmailSent(true);
                toast.success("Email sent! Check your inbox.");
                setShowSpinner(false);
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Failed to send email.");
                setShowSpinner(false);
            });
    }

    function changePassword() {
        setShowSpinner(true);
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        axios
            .post(import.meta.env.VITE_BACKEND_URL + "/api/user/changepw", {
                email,
                otp,
                password,
            })
            .then(() => {
                toast.success("Password changed! You can now log in.");
                setShowSpinner(false);
                navigate("/login");
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Failed to change password.");
                window.location.reload();
                setShowSpinner(false);
            });
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-[#D16BA5] to-[#48CAE4] p-4">

            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 animate-fade-in">

                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-[#2C3E50] mb-8">
                    {emailSent ? "Reset Password" : "Forgot Password"}
                </h1>

                {/* Email Step */}
                {!emailSent && (
                    <>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-[#D16BA5] outline-none transition-all"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />

                        <button
                            onClick={sendEmail}
                            className="w-full bg-[#D16BA5] hover:bg-[#C25597] text-white font-semibold py-3 rounded-xl shadow-md transition-all hover:-translate-y-1"
                        >
                            {showSpinner ? "Sending Email" : "Send Reset Email"}
                        </button>
                    </>
                )}

                {/* OTP & Password Step */}
                {emailSent && (
                    <>
                        {/* OTP */}
                        <div className="mb-4">
                            <label className="text-sm text-gray-600">Enter OTP</label>
                            <input
                                type="text"
                                placeholder="OTP"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-[#48CAE4] outline-none transition-all"
                                onChange={(e) => setOtp(e.target.value)}
                                value={otp}
                            />
                        </div>

                        {/* New Password */}
                        <div className="mb-4">
                            <label className="text-sm text-gray-600">New Password</label>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-[#48CAE4] outline-none transition-all"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-6">
                            <label className="text-sm text-gray-600">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-[#48CAE4] outline-none transition-all"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                            />
                        </div>

                        {/* Button */}
                        <button
                            onClick={changePassword}
                            className="w-full bg-[#2C3E50] hover:bg-[#1f2e3c] text-white font-semibold py-3 rounded-xl shadow-md transition-all hover:-translate-y-1"
                        >
                            { showSpinner? "Reseting Password":"Reset Password"}
                        </button>
                    </>
                )}

            </div>
        </div>
    );
}
