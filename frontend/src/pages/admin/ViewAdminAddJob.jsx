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
import { IoMdArrowRoundBack } from "react-icons/io";

export default function AdminAddJob() {
  const [jobs, setJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [fileModalJob, setFileModalJob] = useState(null);
  // Filters
  const [searchPhoneNumber, setSearchPhoneNumber] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [jobDate, setJobDate] = useState("");
  const [searchName, setSearchName] = useState("");

  const navigate = useNavigate();

  // Fetch jobs
  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/job", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((res) => {
          setJobs(res.data);
          setLoaded(true);
        })
        .catch(() => {
          toast.error("Failed to fetch jobs");
          setLoaded(true);
        });
    }
  }, [loaded]);

  // Delete job
  async function deleteJob(jobID) {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/api/job/" + jobID,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      toast.success("Job deleted");
      setLoaded(false);
    } catch (err) {
      toast.error("Failed to delete job");
    }
  }

  // Filters
  const filteredJobs = jobs.filter((job) => {
    const matchName = job.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());

    const matchPhone = job.phoneNumber
      ?.toLowerCase()
      .includes(searchPhoneNumber.toLowerCase());

    const matchStatus = searchStatus
      ? job.items?.some(
          (i) => i.status?.toLowerCase() === searchStatus.toLowerCase()
        )
      : true;

    const matchNeedDate = searchDate
      ? new Date(job.needDate).toLocaleDateString() ===
        new Date(searchDate).toLocaleDateString()
      : true;

    const matchJobDate = jobDate
      ? new Date(job.jobDate).toLocaleDateString() ===
        new Date(jobDate).toLocaleDateString()
      : true;

    return (
      matchName &&
      matchPhone &&
      matchStatus &&
      matchNeedDate &&
      matchJobDate
    );
  });

  // Group by customer
  const customers = Object.values(
    filteredJobs.reduce((acc, job) => {
      const key = job.phoneNumber;
      if (!acc[key]) {
        acc[key] = {
          name: job.name,
          phoneNumber: job.phoneNumber,
          email: job.email,
          jobs: [],
        };
      }
      acc[key].jobs.push(job);
      return acc;
    }, {})
  );

  // PDF
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


  //print button
  const printJob = async (jobData) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [70, 210], // Bill / Receipt size
    });
  
    // Sinhala font
    doc.addFileToVFS("NotoSansSinhala.ttf", NotoSinhalaBase64);
    doc.addFont("NotoSansSinhala.ttf", "NotoSinhala", "normal");
    doc.setFont("NotoSinhala");

    // Center title
    doc.setFontSize(16);
    doc.text("CHANNA GRAPHICS", 35, 10, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Job ID: ${jobData.jobID}`, 5, 22);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 5, 28);

    doc.setFontSize(14);
    doc.setTextColor(255, 0, 0);
    doc.text(
      `Need Date: ${new Date(jobData.needDate).toLocaleDateString()}`,
      5,
      38
    );

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
        doc.addImage(dataUrl, "PNG", 40, 15, 28, 12);
      }
    } catch (err) {
      console.error("Failed to load logo for PDF", err);
    }

    let y = 45;

    
    // CUSTOMER INFO
   
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("Customer Info", 5, y);
    y += 3;
    doc.line(5, y, 75, y);
    y += 5;

    doc.setFontSize(9);
    doc.text(`Requested by : ${jobData.name}`, 5, y); y += 4;
    doc.text(`Phone        : ${jobData.phoneNumber}`, 5, y); y += 4;
    doc.text(`Email        : ${jobData.email || "-"}`, 5, y); y += 4;
    doc.text(
    `Job Date     : ${new Date(jobData.jobDate).toLocaleDateString()}`,
    5,
    y
    ); 
    y += 4;
    doc.text(
    `Need Date    : ${new Date(jobData.needDate).toLocaleDateString()}`,
    5,
    y
    );
    y += 6;

   
    // ITEMS 
    jobData.items.forEach((item, index) => {
    // Page break
    if (y > 270) {
      doc.addPage();
      y = 15;
    }

    // Item title
    doc.setFontSize(10);
    doc.text(
      `${String(index + 1).padStart(2, "0")}. ${item.type.toUpperCase()}`,
      5,
      y
    );
    y += 4;

    // Status line
    doc.setFontSize(9);
    doc.text(`Status : ${item.status}`, 5, y);
    y += 4;

    doc.line(5, y, 75, y);
    y += 3;

    // Item data (dynamic fields)
    doc.setFontSize(8);

    Object.entries(item.data || {}).forEach(([key, value]) => {
      if (y > 270) {
        doc.addPage();
        y = 15;
      }

      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (c) => c.toUpperCase());

      doc.text(`${label} : ${value}`, 7, y);
      y += 4;
    });

    // Bottom divider
    y += 1;
    doc.line(5, y, 75, y);
    y += 4;
    });


    // Print
    doc.autoPrint();
    const blobUrl = doc.output("bloburl");
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
  };


  return (
    <div className="w-full mb-10 ">

      {/* Back */}
      <Link to="/admin/viewjob">
        <IoMdArrowRoundBack className="text-3xl bg-gray-300 rounded p-1 hover:bg-gray-400" />
      </Link>

      {/* Add Job */}
      <Link
        to="/admin/addadminjob"
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl"
      >
        <FaPlus />
      </Link>

      {/* Filters */}
      <div className="flex flex-wrap gap-5 bg-white p-5 rounded-xl shadow mt-6 justify-center">
        <input
          placeholder="Search Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Phone"
          value={searchPhoneNumber}
          onChange={(e) => setSearchPhoneNumber(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <input type="date" value={jobDate} onChange={(e) => setJobDate(e.target.value)} className="border p-2 rounded"/>
        <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="border p-2 rounded"/>

        <button
          onClick={() => {
            setSearchName("");
            setSearchPhoneNumber("");
            setSearchStatus("");
            setSearchDate("");
            setJobDate("");
          }}
          className="bg-gray-200 px-4 rounded"
        >
          Clear
        </button>
      </div>

      {/* Loading */}
      {!loaded && (
        <div className="flex justify-center mt-10">
          <VscLoading className="animate-spin text-4xl text-blue-500" />
        </div>
      )}

      {/* Customer Cards */}
      {loaded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {customers.map((c, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedCustomer(c)}
              className="p-5 rounded-xl shadow cursor-pointer hover:shadow-lg bg-gradient-to-br from-pink-50 to-blue-200"
            >
              <h2 className="text-xl font-bold text-blue-600">{c.name}</h2>
              <p className="text-gray-600">📞 {c.phoneNumber}</p>
              <span className="inline-block mt-3 bg-red-200 px-3 py-1 rounded-full text-sm">
                Jobs: {c.jobs.length}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-600">
              {selectedCustomer.name}
            </h2>
            <p className="mb-4">📞 {selectedCustomer.phoneNumber}</p>

            {selectedCustomer.jobs.map((job, jobIdx) => (
              <div key={job.jobID} className="border p-4 rounded mb-4">
                <div className="flex gap-20">
                  <h3 className="font-bold">Job ID : {job.jobID}</h3>
                  <h2 className="font-bold">Type : {job.items[0]?.type}</h2>
                  <h2 className="font-style: italic text-red-600">Status : {job.items[0]?.status}</h2>
                </div>
                   
                  <p className="text-sm mt-2">
                    {new Date(job.jobDate).toLocaleDateString()} →{" "}
                    <span className="text-red-600">{new Date(job.needDate).toLocaleDateString()}</span>
                  </p>
               

                <div className="flex gap-4 mt-3">
                  <button
                      onClick={() => setFileModalJob(job)}
                      className="bg-[#48CAE4] hover:bg-[#119dba] text-black px-3 py-1 rounded-full"
                  >
                    View 
                  </button>
                  <button
                    onClick={() => generatePDF(job)}
                    className="bg-green-500 hover:bg-green-700 text-white px-3 rounded-full"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => printJob(job)}
                    className="bg-gray-500 hover:bg-green-700 text-white px-3 rounded-full"
                  >
                    Print
                  </button>
                  <div className="flex gap-2 ml-3 ">
                    <MdOutlineEdit
                      onClick={() => navigate(`/admin/editjob/${job.jobID}`)}
                      className="text-2xl text-blue-500 cursor-pointer hover:text-[30px]"
                    />
                    <MdOutlineDeleteOutline
                      onClick={() => deleteJob(job.jobID)}
                      className="text-2xl text-red-500 cursor-pointer hover:text-[30px]"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setSelectedCustomer(null)}
              className="bg-gray-500 hover:bg-gray-700 text-white px-5 py-2 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
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

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setFileModalJob(null)}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
