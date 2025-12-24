import { Link, useNavigate } from "react-router-dom";
import { TbUserStar } from "react-icons/tb";
import { TbUser } from "react-icons/tb";

export default function ViewJob() {
    
    return (
        <div className="flex flex-col items-center justify-center gap-8 m-4 mt-50 max-w-md mx-auto text-2xl">
            <Link
                to="/admin/viewjobcustomer"
                className="w-full border border-black rounded-xl px-6 py-4 font-semibold 
                            shadow-md transition-all duration-300 
                            hover:bg-blue-300 hover:scale-105 
                            active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400
                            flex items-center justify-center bg-blue-200"
            >
               <TbUser className="mr-3"/>
                Customer Jobs
            </Link>

            <Link
                to="/admin/viewadminAddjob"
                className="w-full border border-black rounded-xl px-6 py-4 font-semibold 
                            shadow-md transition-all duration-300 
                            hover:bg-gray-300 hover:scale-105 
                            active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400
                            flex items-center justify-center bg-gray-200"
            >
                <TbUserStar className="mr-3 "/>
                General Jobs
            </Link>
                    
        </div>
    );
}
