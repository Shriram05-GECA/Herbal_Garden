import { useState } from "react";
import { X } from "lucide-react";

const FloatingBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Video Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-green-600 cursor-pointer z-50"
      >
        <video
          src="/chatbot-bot.mp4" // your video file path
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Popup Iframe */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50">
          <div className="relative w-[350px] h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-green-600 bg-white">
            <iframe
              src="/remedies-bot.html"
              className="w-full h-full border-none"
              title="Remedies AI"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingBot;
