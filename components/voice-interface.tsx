"use client";

import { useState } from "react";
import { useMode } from "@/contexts/ModeContext";
import { Mic, MicOff, Phone } from "lucide-react";

interface VoiceInterfaceProps {
  onEndCall: () => void;
}

export function VoiceInterface({ onEndCall }: VoiceInterfaceProps) {
  const { activeColor, activeLightColor } = useMode();
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    setIsListening(!isListening);
    // Here you would typically start/stop the voice recognition
  };

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: activeLightColor }}
    >
      <div className="relative w-64 h-64 mb-8">
        <svg
          className="w-full h-full"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
          <g filter="url(#goo)">
            <circle
              className={`blob ${isListening ? "listening" : ""}`}
              cx="100"
              cy="100"
              r="50"
              fill={activeColor}
            />
            <circle
              className={`blob ${isListening ? "listening" : ""}`}
              cx="100"
              cy="100"
              r="50"
              fill={activeColor}
            />
            <circle
              className={`blob ${isListening ? "listening" : ""}`}
              cx="100"
              cy="100"
              r="50"
              fill={activeColor}
            />
          </g>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Mic
            className={`w-16 h-16 text-white transition-transform duration-300 ${
              isListening ? "scale-110" : "scale-100"
            }`}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={toggleListening}
          className="p-4 text-black border-2 border-black rounded-full shadow-brutal hover:shadow-brutal-lg transition-shadow"
          style={{ backgroundColor: isListening ? "red" : activeColor }}
        >
          {isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={onEndCall}
          className="p-4 text-black border-2 border-black rounded-full shadow-brutal hover:shadow-brutal-lg transition-shadow"
          style={{ backgroundColor: activeColor }}
        >
          <Phone className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
