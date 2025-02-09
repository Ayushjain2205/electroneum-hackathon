"use client";

import { Send, Phone, ImagePlus, X, MessageSquare } from "lucide-react";
import { type FormEvent, useState, useRef } from "react";
import { useMode } from "@/contexts/ModeContext";
import { cn } from "@/lib/utils";
import { Message } from "./message";

interface ChatInputProps {
  onSend: (message: string, attachment?: File) => void;
  onCallStart: () => void;
  isLoading?: boolean;
}

export function ChatInput({
  onSend,
  onCallStart,
  isLoading = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeColor, activeLightColor } = useMode();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((message.trim() || selectedFile) && !isLoading) {
      onSend(message, selectedFile || undefined);
      setMessage("");
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          validateAndSetFile(file);
          break;
        }
      }
    }
  };

  return (
    <div
      className="border-t-2 border-black p-4"
      style={{ backgroundColor: activeLightColor }}
    >
      {/* Compact Image Preview */}
      {selectedFile && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative group">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-12 h-12 object-cover rounded border border-black"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setSelectedFile(null);
              }}
              className="absolute -top-1 -right-1 p-1 bg-white border border-black rounded-full text-black hover:bg-gray-100 transition-colors shadow-brutal z-10"
            >
              <X className="w-2.5 h-2.5" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded">
              <div className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {(selectedFile.size / 1024 / 1024).toFixed(1)}MB
              </div>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="container mx-auto max-w-4xl"
        onPaste={handlePaste}
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCallStart}
            className="p-3 text-black border-2 border-black rounded-lg shadow-brutal hover:shadow-brutal-lg transition-shadow"
            style={{ backgroundColor: activeColor }}
          >
            <Phone className="w-5 h-5" />
          </button>

          <div
            className={cn(
              "flex-1 relative",
              isDragging && "ring-2 ring-primary"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                selectedFile
                  ? "Add a message with your image..."
                  : "Type your message or drop an image here..."
              }
              className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white pr-12"
              disabled={isLoading}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-black rounded-md transition-colors"
            >
              <ImagePlus className="w-5 h-5" />
            </button>
          </div>

          <button
            type="submit"
            className="p-3 text-black border-2 border-black rounded-lg shadow-brutal hover:shadow-brutal-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: activeColor }}
            disabled={isLoading || (!message.trim() && !selectedFile)}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
