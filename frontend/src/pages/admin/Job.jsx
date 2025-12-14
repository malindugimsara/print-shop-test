import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { MdOutlineDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function Job() {
  const [job, setJob] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectdJob, setSelectedJob] = useState(null);
  const [fileModalJob, setFileModalJob] = useState(null);

  // Filter states
  const [searchEmail, setSearchEmail] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchJobID, setSearchJobID] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/job", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((response) => {
          setJob(response.data);
          setLoaded(true);
        })
        .catch(() => {
          toast.error("Failed to fetch Job");
          setLoaded(true);
        });
    }
  }, [loaded]);

  async function deletejob(jobID) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undo."
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/job/" + jobID, {
        headers: { Authorization: "Bearer " + token },
      });
      setLoaded(false);
      toast.success("Job deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete Job. Please try again.");
    }
  }

  function generateQRData(job) {
    return JSON.stringify({
      jobID: job.jobID,
      name: job.name,
      email: job.email,
      phoneNumber: job.phoneNumber,
      details: job.details,
      needDate: job.needDate,
      status: job.status,
      images: job.images
    });
  }

  const filteredJobs = job.filter((job) => {
    const matchesJobID = job.jobID?.toLowerCase().includes(searchJobID.toLowerCase());
    const matchesEmail = job.email?.toLowerCase().includes(searchEmail.toLowerCase());
    const matchesStatus = searchStatus ? job.status?.toLowerCase() === searchStatus.toLowerCase() : true;
    const matchesDate = searchDate
      ? new Date(job.needDate).toLocaleDateString() === new Date(searchDate).toLocaleDateString()
      : true;

    return matchesJobID && matchesEmail && matchesStatus && matchesDate;
  });

  return (
    <div className="w-full h-full mb-10">
      {/* ➕ Add Job Button */}
      <Link
        to={"/admin/addjob"}
        className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 shadow-xl text-white bg-blue-600 hover:bg-blue-700 p-4 sm:p-5 text-3xl rounded-full flex items-center gap-2 transition-all duration-200 border-4 border-white z-50"
        title="Add Job"
      >
        <FaPlus />
      </Link>

      {/* 🔍 Filters */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 my-4 sm:my-8 flex-wrap bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-blue-100">
        <input
          type="text"
          placeholder="Search by job ID..."
          value={searchJobID}
          onChange={(e) => setSearchJobID(e.target.value)}
          className="border border-blue-200 p-2 sm:p-3 rounded-lg focus:outline-blue-400 min-w-[140px] sm:min-w-[180px] shadow-sm"
        />
        <input
          type="text"
          placeholder="Search by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border border-blue-200 p-2 sm:p-3 rounded-lg focus:outline-blue-400 min-w-[140px] sm:min-w-[180px] shadow-sm"
        />
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="border border-blue-200 p-2 sm:p-3 rounded-lg focus:outline-blue-400 min-w-[140px] sm:min-w-[150px] shadow-sm"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border border-blue-200 p-2 sm:p-3 rounded-lg focus:outline-blue-400 min-w-[140px] sm:min-w-[150px] shadow-sm"
        />
        <button
          onClick={() => {
            setSearchEmail("");
            setSearchStatus("");
            setSearchDate("");
            setSearchJobID("");
          }}
          className="bg-gray-200 hover:bg-gray-300 px-3 sm:px-5 py-2 rounded-lg transition-all duration-200 font-semibold text-gray-700 shadow"
        >
          Clear
        </button>
      </div>

      {loaded && (
        <div className="overflow-x-auto mt-4 sm:mt-6">
          <table className="w-full min-w-[700px] sm:min-w-full bg-white rounded-xl shadow-lg border border-blue-100">
            <thead>
              <tr className="text-center bg-blue-200">
                <th className="p-2 sm:p-4 font-bold text-blue-700">Job ID</th>
                <th className="p-2 sm:p-4 font-bold text-blue-700">Name</th>
                <th className="p-2 sm:p-4 font-bold text-blue-700">E-mail</th>
                <th className="p-2 sm:p-4 font-bold text-blue-700">Phone Number</th>
                <th className="p-2 sm:p-4 font-bold text-blue-700">Details</th>
                <th className="p-2 sm:p-4 font-bold text-blue-700">Need Date</th>
                <th className="p-2 sm:p-4 font-bold text-blue-700">Status</th>
                <th className="p-2 sm:p-4 font-bold text-blue-700">File</th>
                <th className="p-2 sm:p-4 font-bold text-blue-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job, index) => (
                <tr
                  key={index}
                  className="text-center border-b border-blue-100 hover:bg-blue-50 transition-all duration-150"
                >
                  <td className="p-2 sm:p-4">{job.jobID}</td>
                  <td className="p-2 sm:p-4">{job.name}</td>
                  <td className="p-2 sm:p-4">{job.email}</td>
                  <td className="p-2 sm:p-4">{job.phoneNumber}</td>
                  <td className="p-2 sm:p-4">{job.details}</td>
                  <td className="p-2 sm:p-4">{new Date(job.needDate).toLocaleDateString()}</td>
                  <td className="p-2 sm:p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-black text-[12px] font-semibold shadow ${
                        job.status === "Completed"
                          ? "bg-green-500"
                          : job.status === "In Progress"
                          ? "bg-[#48CAE4]"
                          : "bg-[#FFD166]"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="p-2 sm:p-4">
                    <button
                      onClick={() => setFileModalJob(job)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 shadow "
                      title="View Files"
                    >
                      Files
                    </button>
                  </td>



                  <td className="p-2 sm:p-4">
                    <div className="flex flex-wrap justify-center gap-2">
                      <MdOutlineDeleteOutline
                        onClick={() => deletejob(job.jobID)}
                        className="text-[22px] hover:text-red-600 cursor-pointer transition-all duration-150"
                        title="Delete"
                      />
                      <MdOutlineEdit
                        onClick={() => navigate("/admin/editjob/", { state: job })}
                        className="text-[22px] hover:text-blue-600 cursor-pointer transition-all duration-150"
                        title="Edit"
                      />
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 shadow"
                        title="Show QR"
                      >
                        QR
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loaded && (
        <div className="w-full h-full flex items-center justify-center">
          <VscLoading className="text-[60px] animate-spin text-blue-500" />
        </div>
      )}

      {loaded && filteredJobs.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg font-semibold">No job found for these filters.</p>
      )}

      {fileModalJob && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Files for {fileModalJob.jobID}</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {fileModalJob.images?.map((fileUrl, i) => (
                <div key={i} className="flex flex-col items-center">
                  {fileUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                    <img src={fileUrl} className="w-32 h-32 object-cover rounded mb-2" />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded mb-2">
                      <span className="text-gray-600">File</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {/* Preview Button */}
                    <button
                      onClick={() => window.open(fileUrl, "_blank")}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Preview
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(fileUrl);
                          if (!response.ok) throw new Error("Failed to fetch file");
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `job-${fileModalJob.jobID}-file${i + 1}`;
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          window.URL.revokeObjectURL(url);
                        } catch (err) {
                          console.error("Download error:", err.message);
                          alert("Failed to download file.");
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setFileModalJob(null)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}



      {/* QR Code Modal */}
      {selectdJob && (
        <div className="fixed inset-0 bg-blue-100 bg-opacity-40 flex justify-center items-center z-50 p-4 sm:p-0">
          <div className="bg-white p-6 sm:p-10 rounded-xl text-center shadow-2xl relative w-full max-w-[400px] border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">Job QR Code</h2>
            <QRCodeCanvas value={generateQRData(selectdJob)} size={220} className="mx-auto" />
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center">
              <button
                onClick={() => setSelectedJob(null)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-150 shadow"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const canvas = document.querySelector("canvas");
                  const url = canvas.toDataURL("image/png");
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `job-${selectdJob.jobID}.png`;
                  a.click();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-150 shadow"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
