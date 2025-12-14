import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiMenu, FiX, FiFileText, FiPrinter } from "react-icons/fi";
import { FaUsers, FaClipboardList } from "react-icons/fa";
import { VscSignOut } from "react-icons/vsc";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CiSquarePlus } from "react-icons/ci";
import CreateAdminAccount from "./admin/CreateAdminAccount.jsx";
import UsersPage from "./admin/UserPage.jsx";
import EditUser from "./admin/EditUser.jsx";
import WelcomeAdmin from "../components/WelcomeAdmin.jsx";
import Job from "./admin/Job.jsx";
import AddJob from "./admin/AddJob.jsx";
import EditJob from "./admin/EditJob.jsx";
import JobReportPage from "./admin/JobReportPage.jsx";
import ViewJob from "./admin/ViewJob.jsx";

export default function AdminPage() {
  const location = useLocation();
  const path = location.pathname;
  const [status, setStatus] = useState("loading");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauthenticated");
      navigate("/home")
    } else {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.role !== "admin") {
            setStatus("unauthorized");
            toast.error("You are not authorized to access this page");
            navigate("/home")
          } else {
            setStatus("authenticated");
          }
        })
        .catch(() => {
          setStatus("unauthenticated");
          toast.error("You are not authenticated, please login");
          navigate("/home")
        });
    }
  }, [status]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full h-screen flex bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA]">
      {status === "loading" ? (
        <div className="flex justify-center items-center w-full h-full">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-b-transparent border-[#D16BA5]"></div>
        </div>
      ) : (
        <>
          {/* Mobile top bar */}
          <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-[#D16BA5] to-[#48CAE4] shadow-lg flex items-center px-4 z-50">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-white/20 text-white transition-all"
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <img src="/logo.png" alt="logo" className="w-30 ml-3"/>

            <div className="ml-auto flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white">
                {JSON.parse(localStorage.getItem("user"))?.name?.[0] || "A"}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-[260px] bg-gradient-to-b from-[#2C3E50] to-[#1E1E1E] shadow-xl flex flex-col p-6 pt-20 md:pt-6 transition-transform duration-300 z-40 border-r border-gray-700
            ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
          >
            {/* Profile */}
            <div className="mb-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D16BA5] to-[#48CAE4] flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-3 ring-4 ring-[#FFD166]/30">
                {JSON.parse(localStorage.getItem("user"))?.name?.[0] || "A"}
              </div>
              <span className="text-lg font-semibold text-white">
                {JSON.parse(localStorage.getItem("user"))?.name || "Admin"}
              </span>
              <span className="text-sm text-[#FFD166] bg-[#FFD166]/10 px-3 py-1 rounded-full mt-1">
                Administrator
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-3">
              <SidebarLink to="/admin/" icon={<FiHome />} label="Home" path={path} />
              <SidebarLink to="/admin/addjob" icon={<CiSquarePlus />} label="Add Jobs" path={path} />
              <SidebarLink to="/admin/viewjob" icon={<FiPrinter />} label="View Jobs" path={path} />
              <SidebarLink to="/admin/users" icon={<FaUsers />} label="User" path={path} />
              <SidebarLink to="/admin/report" icon={<FiFileText />} label="Reports" path={path} />
              <SidebarLink to="/admin/createaccount" icon={<FaClipboardList />} label="Create Account" path={path} />
            </nav>

            {/* Sign Out */}
            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-3 rounded-lg font-semibold text-gray-300 hover:bg-[#D16BA5]/20 hover:text-[#D16BA5] transition-all duration-200"
              >
                <VscSignOut className="mr-3 text-[#D16BA5]" /> Sign Out
              </button>
            </div>
          </div>

          {/* Overlay (mobile) */}
          {menuOpen && (
            <div
              className="fixed inset-0 bg-opacity-40 z-30 md:hidden"
              onClick={() => setMenuOpen(false)}
            ></div>
          )}

          {/* Main content */}
          <div className="flex-1 bg-[#F8F9FA] rounded-xl pt-3 overflow-y-auto md:ml-[260px] mt-16 md:mt-0 shadow-inner px-6 md:px-10 ">
            <div className="flex justify-end mt-2">
              <img src="/logo.png" alt="logo" className="w-40 hidden md:flex" />
            </div>
            
            <Routes>
              <Route path="/" element={<WelcomeAdmin />} />
              <Route path="/addjob" element={<AddJob />} />
              <Route path="/viewjob" element={<ViewJob />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/report" element={<JobReportPage />} />
              <Route path="/createaccount" element={<CreateAdminAccount />} />
              <Route path="/edituser" element={<EditUser />} />
              <Route path="/editjob/:jobId" element={<EditJob />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

function SidebarLink({ to, icon, label, path }) {
  const isActive = path === to;
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-[#D16BA5] to-[#48CAE4] text-white shadow-md"
          : "text-gray-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="mr-3">{icon}</span> {label}
    </Link>
  );
}
