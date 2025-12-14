import ServiceCard from "./ServiceCard";

export default function ServicesGrid() {
  const services = [
    {
      icon: "📄",
      title: "Document Printing",
      description: "High-quality document printing for all your business and personal needs.",
      color: "#48CAE4",
    },
    {
      icon: "🖼️",
      title: "Photo Printing",
      description: "Professional photo prints on premium paper with vibrant colors.",
      color: "#D16BA5",
    },
    {
      icon: "📦",
      title: "3D Printing",
      description: "Cutting-edge 3D printing services for prototypes and custom designs.",
      color: "#FFD166",
    },
    {
      icon: "🎨",
      title: "Custom Designs",
      description: "Personalized designs for business cards, flyers, and marketing materials.",
      color: "#2C3E50",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#2C3E50] md:text-4xl">
          Our Services
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
