import { useState } from "react";

export default function UploadFilePage() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setFile(e.dataTransfer.files[0]);
  };


  


  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center px-6 py-16 pt-30 ">
      
      {/* Title */}
      <h1 className="text-4xl font-bold text-[#2C3E50] mb-6">
        Upload Print File
      </h1>

      {/* Subtitle */}
      <p className="text-[#1E1E1E]/70 text-lg mb-10 text-center max-w-xl">
        Upload your documents or images for high-quality printing.
      </p>

      {/* Upload Box */}
      <div
        className={`
          w-full max-w-xl p-10 rounded-2xl border-2 border-dashed 
          transition-all cursor-pointer
          ${isDragging ? "border-[#48CAE4] bg-[#48CAE4]/10" : "border-[#E0E0E0] bg-white"}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">📁</div>
          <p className="text-lg text-[#1E1E1E]/70">
            {file ? (
              <span className="font-semibold text-[#2C3E50]">
                {file.name}
              </span>
            ) : (
              "Drag & drop your file here"
            )}
          </p>
          <p className="text-sm text-[#1E1E1E]/50 mt-2">
            or click to browse
          </p>

          {/* Hidden Input */}
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-6 block mx-auto"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-10">
        
        {/* Clear Button */}
        <button
          onClick={() => setFile(null)}
          className="
            px-6 py-3 rounded-xl 
            bg-[#E0E0E0] text-[#1E1E1E] font-semibold 
            hover:bg-[#CCCCCC] transition-all
          "
        >
          Clear
        </button>

        {/* Upload Button */}
        <button
          className="
            px-6 py-3 rounded-xl 
            bg-[#D16BA5] text-white font-semibold shadow-md 
            hover:bg-[#c25796] hover:scale-105 transition-all
          "
        >
          Upload
        </button>

      </div>
    </div>
  );
}
