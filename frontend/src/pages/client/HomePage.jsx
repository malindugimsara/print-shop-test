import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import ServicesGrid from "../../components/ServicesGrid";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="relative z-10 pt-10 ">
      <section className="bg-[#F8F9FA] py-20">
        <div className="container mx-auto px-4 text-center md:px-6">

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold text-[#2C3E50] md:text-6xl">
            Welcome to PrintShop
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-lg text-[#1E1E1E]/70 md:text-xl">
            Fast, high-quality printing at your fingertips.
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">

            {/* Upload Button */}
            <button
              onClick={() => navigate("/addorder")}
              className="
                w-full sm:w-auto px-8 py-3 rounded-xl 
                bg-[#D16BA5] text-white font-semibold 
                shadow-md transition-all 
                hover:bg-[#c25796] hover:scale-105
              "
            >
              Upload Print File
            </button>

            {/* View Orders Button */}
            <button
              onClick={() => navigate("/myorder")}
              className="
                w-full sm:w-auto px-8 py-3 rounded-xl 
                border border-[#48CAE4] text-[#48CAE4] font-semibold 
                transition-all hover:bg-[#48CAE4] hover:text-white hover:scale-105
              "
            >
              View Orders
            </button>
          </div>
        </div>
        <ServicesGrid />
      </section>
    
    
    </div>
  )
}