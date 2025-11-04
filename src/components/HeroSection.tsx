import React from "react";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import plantVideo from "@/assets/plant.mp4"; // ✅ import the video from assets

interface HeroSectionProps {
  user: any;
  isAdmin: boolean;
  navigate: (path: string) => void;
  handleSignOut: () => void;
  title: string;
  subtitle: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  user,
  isAdmin,
  navigate,
  handleSignOut,
  title,
  subtitle,
}) => {
  return (
    <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* 🎬 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={(e) => e.currentTarget.play().catch(() => {})}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={plantVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🌫 Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-background"></div>

      {/* 🌿 Foreground Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {user ? (
              <>
                {isAdmin && (
                  <Button onClick={() => navigate("/admin")} variant="default">
                    Add Plant
                  </Button>
                )}
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="default">
                Sign In
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col items-center justify-center h-full mt-20">
          <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
            <Leaf className="h-12 w-12 text-green-400 animate-pulse" />
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              {title}
            </h1>
          </div>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fade-in">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
