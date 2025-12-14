import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegRegistered } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";

export default function UserData(){
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token != null) {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/user/current",  {
                headers: {
                    Authorization : "Bearer " + token,
                },
            }).then((response) => {
                setUserData(response.data.user);
            }).catch((error) => {
                console.error("Error fetching user data:", error);
                setUserData(null);
            })
        }
    }, []);

    return(
        <div>
            {
                (userData==null) ? (
                    <div className="flex flex-row gap-2">
                        <button
                            onClick={() => {
                                navigate("/login");
                                closeMobileMenu();
                            }}
                            className="hidden md:flex w-full flex items-center justify-center bg-[#D16BA5] hover:bg-[#C35C9B] text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all hover:-translate-y-1"
                        >
                            <VscAccount className="mr-2 text-lg" />
                            Sign In
                        </button>

                        <button 
                            onClick={() => {
                                navigate("/register");
                                closeMobileMenu();
                            }}
                            className="hidden md:flex w-full flex items-center justify-center bg-[#48CAE4] hover:bg-blue-400 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all hover:-translate-y-1 "
                        >
                            <FaRegRegistered className="mr-2 text-lg" /> 
                            Register
                        </button>

                    </div>
            
                    ) : (
                    <button
                        onClick={() => {
                        localStorage.removeItem("token");
                        setUserData(null);
                        navigate("/login");
                        }}
                        className="hidden md:flex items-center bg-[#FFD166] hover:bg-[#F7C553] text-[#1E1E1E] px-2 py-1 rounded-xl font-semibold shadow-md transition-all hover:-translate-y-1"
                    >
                        <FiLogOut className="mr-2 text-lg" /> Sign Out
                    </button>
                    )
                }

        </div>

    )
}