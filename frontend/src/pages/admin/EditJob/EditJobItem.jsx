import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

export default function EditJobItem({ index, item, updateItem, removeItem }) {
  const handleChange = (field, value) => {
    updateItem(index, { ...item, [field]: value });
  };
   const [gender, setGender] = useState("");


  return (
    <div className="border border-gray-300 rounded-xl p-6 bg-white shadow-sm mb-6">

      <div className="flex justify-between">
        <h3 className="font-bold text-xl text-[#2C3E50]">Tute {index + 1}</h3>
  
        {index > 0 && (
          <button
            onClick={() => removeItem(index)}
            className="text-red-500 hover:text-red-700"
          >
            <FiTrash2 size={22} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
                <label>
                    <input
                    type="radio"
                    value="Duplo"
                    checked={gender === "Duplo"}
                    onChange={(e) => setGender(e.target.value)}
                    className="m-2"
                    />
                    Duplo
                </label>

                <label className="ml-8">
                    <input
                    type="radio"
                    value="Photocopy"
                    checked={gender === "Photocopy"}
                    onChange={(e) => setGender(e.target.value)}
                    className="m-2"
                    />
                    Photocopy
                </label>
            </div>
            
        <div>
          <label className="font-semibold text-[#2C3E50]">Description</label>
          <input
            className="mt-1 w-full border border-gray-300 rounded-lg p-3"
            placeholder="Visiting cards, leaflet, poster..."
            value={item.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold text-[#2C3E50]">Quantity</label>
          <input
            className="mt-1 w-full border border-gray-300 rounded-lg p-3"
            type="number"
            value={item.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold text-[#2C3E50]">Paper Type</label>
          <input
            className="mt-1 w-full border border-gray-300 rounded-lg p-3"
            value={item.paper}
            onChange={(e) => handleChange("paper", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold text-[#2C3E50]">Size</label>
          <input
            className="mt-1 w-full border border-gray-300 rounded-lg p-3"
            placeholder="A4, A5, A3, Custom"
            value={item.size}
            onChange={(e) => handleChange("size", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold text-[#2C3E50]">Finishing</label>
          <input
            className="mt-1 w-full border border-gray-300 rounded-lg p-3"
            placeholder="Cutting, binding, stapling..."
            value={item.finish}
            onChange={(e) => handleChange("finish", e.target.value)}
          />
        </div>
      </div>

    </div>
  );
}
