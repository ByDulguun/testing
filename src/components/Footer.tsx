import { FaFacebookF, FaInstagram, FaWhatsapp, FaWeixin } from "react-icons/fa";
import { FiMapPin, FiPhone } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#c6c6c6] pt-12">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-6 gap-4">
        {/* --- Logo --- */}
        <img
          src="https://res.cloudinary.com/dlt1zyjia/image/upload/v1764310149/header_logo_nmftlr.png"
          alt="CarFinder Logo"
          width={180}
          height={60}
          className="object-contain"
        />


        {/* --- Contact Info --- */}
        <div className="flex flex-col md:flex-row items-center gap-3 text-gray-600 text-base">
          <div className="flex items-center gap-1">
            <FiMapPin className="text-[#E10600]" />
            <span>Hong Kong, Central District</span>
          </div>
          <div className="flex items-center gap-1">
            <FiPhone className="text-[#E10600]" size={20} />
            <span>+852 2888 1122</span>
          </div>
        </div>

        {/* --- Social Media Links --- */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            aria-label="Facebook"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-[#1877F2] hover:text-white rounded-full transition-all shadow-sm text-gray-700 font-medium"
          >
            <FaFacebookF size={20} />
            <span className="hidden sm:inline">Facebook</span>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-[#E1306C] hover:text-white rounded-full transition-all shadow-sm text-gray-700 font-medium"
          >
            <FaInstagram size={20} />
            <span className="hidden sm:inline">Instagram</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/85228881122"
            target="_blank"
            rel="noopener"
            aria-label="WhatsApp"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-[#25D366] hover:text-white rounded-full transition-all shadow-sm text-gray-700 font-medium"
          >
            <FaWhatsapp size={20} />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* WeChat */}
          <a
            href="#"
            aria-label="WeChat"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-[#07C160] hover:text-white rounded-full transition-all shadow-sm text-gray-700 font-medium"
          >
            <FaWeixin size={20} />
            <span className="hidden sm:inline">WeChat</span>
          </a>
        </div>
      </div>

      {/* --- Copyright --- */}
      <div className="border-t border-gray-100 text-center py-3 text-xs text-gray-500">
        © {new Date().getFullYear()} CarFinder Hong Kong. All rights reserved.
      </div>
    </footer>
  );
}
