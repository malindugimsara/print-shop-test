import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#2C3E50] py-8 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm">© 2025 PrintShop. All rights reserved.</p>
          
          <div className="flex gap-6">
            <Link
              
              className="text-sm transition-opacity hover:opacity-80"
            >
              Privacy Policy
            </Link>
            <Link
              to={"/terms"}
              className="text-sm transition-opacity hover:opacity-80"
            >
              Terms of Service
            </Link>
            <Link
              to={"/contact"}
              className="text-sm transition-opacity hover:opacity-80"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;