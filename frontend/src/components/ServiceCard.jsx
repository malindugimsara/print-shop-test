export default function ServiceCard({ icon, title, description, color }) {
  return (
    <div className="p-6 rounded-2xl shadow-md bg-white border border-[#E0E0E0] hover:shadow-lg transition-all">
      
      {/* Icon */}
      <div className="text-5xl mb-4" style={{ color: color }}>
        {icon} {/* icon is now a string */}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-2" style={{ color: color }}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-[#1E1E1E]/70 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
