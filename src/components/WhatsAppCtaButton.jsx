import React from "react";

const WHATSAPP_NUMBER = "916293764220";
const WHATSAPP_MESSAGE =
  "Hi, I'm interested in your school management platform. Could you please share more details?";

const WhatsAppCtaButton = () => {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2 rounded-l-full bg-green-500 px-4 py-3 text-white shadow-lg transition-all hover:bg-green-600 hover:pr-6"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.86.5 3.6 1.38 5.1L2 22l4.98-1.38a9.9 9.9 0 0 0 5.06 1.38c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.17c-1.58 0-3.05-.44-4.3-1.21l-.3-.18-3.02.83.8-3-.2-.31a7.98 7.98 0 0 1-1.2-4.3c0-4.42 3.6-8 8.02-8 2.14 0 4.15.84 5.66 2.35a7.94 7.94 0 0 1 2.35 5.66c0 4.42-3.6 8-8.02 8zm4.4-5.98c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.37-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.12-.49.12-.12.28-.3.42-.46.14-.16.18-.27.28-.45.08-.18.04-.33-.04-.45-.08-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.42-.14 0-.3-.02-.47-.02-.16 0-.42.06-.64.3-.22.24-.86.84-.86 2.04 0 1.2.88 2.36 1 2.52.12.16 1.72 2.64 4.18 3.6 2.46.95 2.46.63 2.9.6.44-.04 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
      </svg>
      <span className="hidden text-sm font-semibold sm:inline">Chat with us</span>
    </a>
  );
};

export default WhatsAppCtaButton;
