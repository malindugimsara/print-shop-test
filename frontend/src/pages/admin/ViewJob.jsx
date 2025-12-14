import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { MdOutlineDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NotoSinhalaBase64 from "./fonts/NotoSinhalaBase64";

export default function ViewJob() {
  const [job, setJob] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [fileModalJob, setFileModalJob] = useState(null);

  // Filters
  const [searchPhonNumber, setSearchPhonNumber] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [jobDate, setJobDate] = useState("");
  const [searchName, setSearchName] = useState("");

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

  // Delete Job
  async function deletejob(jobID) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undone."
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
      toast.error(error.response?.data?.message || "Failed to delete Job.");
    }
  }

  // Filter Jobs
  const filteredJobs = job.filter((job) => {
    const matchesname = job.name?.toLowerCase().includes(searchName.toLowerCase());
    const matchesPhonNumber = job.phoneNumber?.toLowerCase().includes(searchPhonNumber.toLowerCase());

    const matchesStatus = searchStatus
      ? job.items?.some(i => i.status?.toLowerCase() === searchStatus.toLowerCase())
      : true;

    const matchesDate = searchDate
      ? new Date(job.needDate).toLocaleDateString() ===
        new Date(searchDate).toLocaleDateString()
      : true;
    
    const matchesJobDate = jobDate
      ? new Date(job.jobDate).toLocaleDateString() ===
        new Date(jobDate).toLocaleDateString()
      : true;

    return matchesname && matchesPhonNumber && matchesStatus && matchesDate && matchesJobDate;
  });

    const generatePDF = async (jobData) => {
      if (!jobData) return;

      const doc = new jsPDF();

      // ✅ Proper Sinhala font register
      doc.addFileToVFS("NotoSansSinhala.ttf", NotoSinhalaBase64);
      doc.addFont("NotoSansSinhala.ttf", "NotoSinhala", "normal");
      doc.setFont("NotoSinhala");

      // Add Logo - fetch and convert to dataURL to ensure it's loaded before adding
      try {
        const res = await fetch("/logo.png");
        if (res.ok) {
          const blob = await res.blob();
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          doc.addImage(dataUrl, "PNG", 20, 10, 55, 23);
        }
      } catch (err) {
        console.error("Failed to load logo for PDF", err);
      }

      // Header
      doc.setFontSize(25);
      doc.setTextColor(40, 116, 166);
      doc.text("CHANNA GRAPHICS", 80, 20);

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(`Job Details — ${jobData.jobID}`, 81, 30);

      doc.setFontSize(14);
      doc.setTextColor(255, 0, 0);
      doc.text(
        `Need Date: ${new Date(jobData.needDate).toLocaleDateString()}`,
        81,
        37
      );

      // Customer Info
      const customerInfo = [
        ["Requested by", jobData.name],
        ["Email", jobData.email || "-"],
        ["Phone", jobData.phoneNumber],
        ["Job Date", new Date(jobData.jobDate).toLocaleDateString()],
        ["Need Date", new Date(jobData.needDate).toLocaleDateString()],
      ];

      autoTable(doc, {
        startY: 45,
        theme: "grid",
        head: [["Field", "Value"]],
        body: customerInfo,
        styles: {
          font: "NotoSinhala",
          fontSize: 11,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [40, 116, 166],
          textColor: [255, 255, 255],
          font: "NotoSinhala",
          fontStyle: "normal",
        },
      });

      // Items Table
      if (jobData.items?.length > 0) {
        const itemData = jobData.items.map((item, idx) => [
          idx + 1,
          item.type || "N/A",
          item.status || "N/A",
          Object.entries(item.data || {})
            .map(([k, v]) => `${k} : ${v}`)
            .join("\n"),
        ]);

        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          head: [["#", "Type", "Status", "Details"]],
          body: itemData,
          styles: {
            font: "NotoSinhala",
            fontStyle: "normal",
            fontSize: 11,
            cellPadding: 2,
          },
          headStyles: {
            fillColor: [40, 116, 166],
            textColor: [255, 255, 255],
            font: "NotoSinhala",
            fontStyle: "normal",
          },
        });
      }

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("NotoSinhala");
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${pageCount} - CHANNA GRAPHICS`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      doc.save(`Job-${jobData.jobID}.pdf`);
      toast.success("PDF generated successfully!");
    };


  return (
    <div className="w-full h-full mb-10">
      {/* ADD JOB BUTTON */}
      <Link
        to={"/admin/addjob"}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 text-3xl rounded-full shadow-xl border-4 border-white z-50"
      >
        <FaPlus />
      </Link>

      {/* FILTER BAR */}
      <div className="flex flex-wrap justify-center gap-3 bg-white p-5 rounded-xl shadow-lg mt-6 border border-blue-100">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Search by Phone Number"
          value={searchPhonNumber}
          onChange={(e) => setSearchPhonNumber(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg"
        />
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <div className="relative">
            <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600">
                Job Date
            </label>

            <input
                type="date"
                value={jobDate}
                onChange={(e) => setJobDate(e.target.value)}
                className="border border-blue-200 p-3 rounded-lg w-full"
            />
        </div>
        <div className="relative">
            <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600">
                Need Date
            </label>

            <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="border border-blue-200 p-3 rounded-lg w-full"
            />
        </div>

        <button
          onClick={() => {
            setSearchPhonNumber("");
            setSearchStatus("");
            setSearchDate("");
            setSearchJobID("");
            setJobDate("");
          }}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold"
        >
          Clear
        </button>
      </div>

      {/* JOB TABLE */}
      {loaded && (
        <div className="overflow-x-auto mt-6">
          <table className="w-full bg-white rounded-xl shadow-lg border border-blue-100">
            <thead>
              <tr className="text-center bg-blue-200">
                <th className="p-4 font-bold">Job ID</th>
                <th className="p-4 font-bold">Name</th>
                {/* <th className="p-4 font-bold">Email</th> */}
                <th className="p-4 font-bold">Phone</th>
                <th className="p-4 font-bold">Job Date</th>
                <th className="p-4 font-bold">Need Date</th>
                <th className="p-4 font-bold">Items</th>
                <th className="p-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job, idx) => (
                <tr key={idx} className="text-center border-b hover:bg-blue-50">
                  <td className="p-4">{job.jobID}</td>
                  <td className="p-4">{job.name}</td>
                  {/* <td className="p-4">{job.email}</td> */}
                  <td className="p-4">{job.phoneNumber}</td>
                  <td className="p-4">{new Date(job.jobDate).toLocaleDateString()}</td>
                  <td className="p-4">{new Date(job.needDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button
                      onClick={() => setFileModalJob(job)}
                      className="bg-[#48CAE4] hover:bg-[#119dba] text-black px-3 py-1 rounded-full"
                    >
                      View ({job.items?.length})
                    </button>
                  </td>
                  <td className="p-4 flex justify-center gap-4">
                    <MdOutlineDeleteOutline
                      className="text-[24px] text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() => deletejob(job.jobID)}
                    />
                    <MdOutlineEdit
                      className="text-[24px] text-blue-500 hover:text-blue-700 cursor-pointer"
                      onClick={() => navigate(`/admin/editjob/${job.jobID}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LOADING */}
      {!loaded && (
        <div className="w-full h-full flex items-center justify-center">
          <VscLoading className="text-[60px] animate-spin text-blue-500" />
        </div>
      )}

      {/* EMPTY STATE */}
      {loaded && filteredJobs.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg font-semibold">
          No job matches your filters.
        </p>
      )}

      {/* DETAILS MODAL */}
      {fileModalJob && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Job Details — {fileModalJob.jobID}
            </h2>

            {/* Customer Info */}
            <div className="bg-gray-100 p-4 rounded-lg mb-4 border">
              <p><b>Name:</b> {fileModalJob.name}</p>
              <p><b>Email:</b> {fileModalJob.email}</p>
              <p><b>Phone:</b> {fileModalJob.phoneNumber}</p>
              <p><b>Job Date:</b> {new Date(fileModalJob.jobDate).toLocaleDateString()}</p>
              <p><b>Need Date:</b> {new Date(fileModalJob.needDate).toLocaleDateString()}</p>
            </div>

            {/* Items */}
            {fileModalJob.items?.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <h3 className="font-bold text-lg text-gray-700">
                  Item {idx + 1} — <span className="uppercase text-blue-600">{item.type}</span>
                </h3>

                <p className="mt-1 mb-3">
                  <b>Status:</b>{" "}
                  <span className="px-2 py-1 rounded bg-yellow-200">{item.status}</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(item.data || {}).map(([key, value]) => (
                    <div key={key} className="p-2 bg-white border rounded shadow-sm">
                      <p className="text-xs text-gray-500 font-semibold">
                        {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                      </p>
                      <p className="font-medium text-gray-800">{value || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setFileModalJob(null)}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => generatePDF(fileModalJob)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded font-semibold"
              >
                Download PDF
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
