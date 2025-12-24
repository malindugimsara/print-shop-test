import { FiPhone, FiMapPin, FiMail, FiSend } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { SiFacebook } from "react-icons/si";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-20 pb-20 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] mb-2 sm:mb-3">
          Contact Us
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          We're here to help with all your printing needs.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1 - Phone */}
          <div className="bg-gradient-to-br from-[#D16BA5]/20 to-[#48CAE4]/20 backdrop-blur-xl border border-[#E0E0E0] rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 hover:-translate-y-1 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#D16BA5]/30">
                <FiPhone className="text-[#D16BA5] text-lg sm:text-xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#2C3E50]">Phone</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-700">+94 78 78 200 10</p>
          </div>

          {/* Card 2 - Facebook */}
          <div className="bg-gradient-to-br from-[#48CAE4]/20 to-[#D16BA5]/20 backdrop-blur-xl border border-[#E0E0E0] rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 hover:-translate-y-1 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#48CAE4]/30">
                <SiFacebook className="text-[#48CAE4] text-lg sm:text-xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#2C3E50]">Facebook</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-700">Printshop</p>
          </div>

          
          {/* Card 3 - Whatsapp */}
          <div className="bg-gradient-to-br from-[#25D366]/20 to-[#D16BA5]/20 backdrop-blur-xl border border-[#E0E0E0] rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 hover:-translate-y-1 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#25D366]/30">
                <FaWhatsapp className="text-[#25D366] text-lg sm:text-xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#2C3E50]">WhatsApp</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-700">+94 78 78 200 10</p>
          </div>

          {/* Card 4 - Location */}
          <div className="bg-gradient-to-br from-[#FFD166]/20 to-[#48CAE4]/20 backdrop-blur-xl border border-[#E0E0E0] rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 hover:-translate-y-1 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#FFD166]/40">
                <FiMapPin className="text-[#FFD166] text-lg sm:text-xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#2C3E50]">Location</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-700">120/1, 11th Mile post, Elpitiya</p>
          </div>

          {/* Card 5 - Email */}
          <div className="bg-gradient-to-br from-[#48CAE4]/20 to-[#D16BA5]/20 backdrop-blur-xl border border-[#E0E0E0] rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 hover:-translate-y-1 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#48CAE4]/30">
                <FiMail className="text-[#48CAE4] text-lg sm:text-xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#2C3E50]">Email</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-700">channagraphics88@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
