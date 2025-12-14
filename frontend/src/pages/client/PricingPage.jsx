import { FiCheckCircle } from "react-icons/fi";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-28 pb-20 px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[#2C3E50] mb-4">
          Flexible Pricing for Every Print Need
        </h1>
        <p className="text-lg text-gray-600">
          Transparent pricing designed for students, freelancers, and businesses.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

        {/* Basic Plan */}
        <div className="group bg-white/60 backdrop-blur-xl border border-[#E0E0E0] rounded-3xl shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all p-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">Basic</h2>
          <p className="text-gray-600 mb-5">Perfect for small or occasional prints</p>

          <div className="text-5xl font-bold text-[#2C3E50] mb-6">
            Rs.20<span className="text-lg text-gray-600"> / page</span>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-gray-700">
              <FiCheckCircle className="text-[#48CAE4]" /> Black & White Prints
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <FiCheckCircle className="text-[#48CAE4]" /> Basic Document Upload
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <FiCheckCircle /> No Priority Queue
            </li>
          </ul>

          <button className="w-full py-3 rounded-xl bg-[#48CAE4] text-white font-semibold hover:bg-[#2aaecb] transition-all">
            Choose Basic
          </button>
        </div>

        {/* Standard Plan (Recommended) */}
        <div className="group bg-gradient-to-br from-[#D16BA5]/90 to-[#48CAE4]/90 text-white border border-white/20 rounded-3xl shadow-2xl hover:-translate-y-4 hover:shadow-pink-300/40 transition-all p-8">
          <span className="px-4 py-1 bg-[#FFD166] text-black font-semibold rounded-full text-sm mb-4 inline-block">
            Most Popular
          </span>

          <h2 className="text-2xl font-bold mb-2">Standard</h2>
          <p className="text-gray-100 mb-5">Best for regular users and students</p>

          <div className="text-5xl font-bold mb-6">
            Rs.40<span className="text-lg"> / page</span>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-[#FFD166]" /> Color Prints Included
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-[#FFD166]" /> High-Quality Images
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-[#FFD166]" /> Priority Processing
            </li>
            <li className="flex items-center gap-2 text-gray-200">
              <FiCheckCircle /> No Express Delivery
            </li>
          </ul>

          <button className="w-full py-3 rounded-xl bg-[#FFD166] text-[#1E1E1E] font-semibold hover:bg-[#f6c145] transition-all">
            Choose Standard
          </button>
        </div>

        {/* Premium Plan */}
        <div className="group bg-white/60 backdrop-blur-xl border border-[#E0E0E0] rounded-3xl shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all p-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">Premium</h2>
          <p className="text-gray-600 mb-5">Ideal for businesses & bulk printing</p>

          <div className="text-5xl font-bold text-[#2C3E50] mb-6">
            Rs.60<span className="text-lg text-gray-600"> / page</span>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-gray-700">
              <FiCheckCircle className="text-[#D16BA5]" /> Ultra HD Printing
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <FiCheckCircle className="text-[#D16BA5]" /> Express Delivery
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <FiCheckCircle className="text-[#D16BA5]" /> Advanced Layout Tools
            </li>
            <li className="flex items-center gap-2 text-gray-400">
              <FiCheckCircle /> No Ads
            </li>
          </ul>

          <button className="w-full py-3 rounded-xl bg-[#D16BA5] text-white font-semibold hover:bg-[#b9548c] transition-all">
            Choose Premium
          </button>
        </div>

      </div>
    </div>
  );
}
