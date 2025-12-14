import { FiClipboard } from "react-icons/fi";

export default function JobHeader() {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="p-3 bg-[#D16BA5]/20 rounded-xl">
        <FiClipboard className="text-3xl text-[#D16BA5]" />
      </div>
      <div>
        <h1 className="text-4xl font-bold text-[#2C3E50]">Add New Job</h1>
        <p className="text-gray-600">Create and register a new print job.</p>
      </div>
    </div>
  );
}
