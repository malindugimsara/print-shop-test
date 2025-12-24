import { Link, useNavigate } from "react-router-dom";
import { LuUserRoundPlus } from "react-icons/lu";
import { PiUserCirclePlus } from "react-icons/pi";

export default function AddJob() {
    
    return (
        <div className="flex flex-col items-center justify-center gap-8 m-4 mt-50 max-w-md mx-auto text-2xl">
            <Link
                to="/admin/addCustomerJob"
                className="w-full border border-black rounded-xl px-6 py-4 font-semibold 
                            shadow-md transition-all duration-300 
                            hover:bg-blue-300 hover:scale-105 
                            active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400
                            flex items-center justify-center bg-blue-200"
            >
                <LuUserRoundPlus className="mr-3"/>
                 Add Customer Jobs
            </Link>

            <Link
                to="/admin/addadminjob"
                className="w-full border border-black rounded-xl px-6 py-4 font-semibold 
                            shadow-md transition-all duration-300 
                            hover:bg-gray-300 hover:scale-105 
                            active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400
                            flex items-center justify-center bg-gray-300"
            >
                <PiUserCirclePlus className="mr-3 text-3xl"/>
                 Add General Jobs
            </Link>
                    
        </div>
    );
}
