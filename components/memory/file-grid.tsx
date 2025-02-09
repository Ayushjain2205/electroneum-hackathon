"use client";

import { useMode } from "@/contexts/ModeContext";
import { FileText, FileImage, File, Upload, Plus, X } from "lucide-react";
import { useState, useRef } from "react";
import type React from "react"; // Added import for React

interface FileItemProps {
  name: string;
  type: string;
  size: string;
  content?: string;
}

function FileIcon({ type }: { type: string }) {
  switch (type) {
    case "pdf":
    case "docx":
    case "xlsx":
    case "pptx":
      return <FileText className="w-8 h-8" />;
    case "png":
    case "jpg":
    case "gif":
      return <FileImage className="w-8 h-8" />;
    case "md":
      return <FileText className="w-8 h-8" />;
    default:
      return <File className="w-8 h-8" />;
  }
}

function FileItem({ name, type, size }: FileItemProps) {
  const { activeColor } = useMode();

  return (
    <div className="flex flex-col items-center p-2 transition-transform hover:scale-105">
      <div
        className="w-16 h-16 mb-2 flex items-center justify-center bg-white border-2 border-black rounded-lg shadow-brutal"
        style={{ color: activeColor }}
      >
        <FileIcon type={type} />
      </div>
      <div className="text-center">
        <div className="text-sm font-medium truncate max-w-[100px]">{name}</div>
        <div className="text-xs text-gray-600">{size}</div>
      </div>
    </div>
  );
}

interface FileGridProps {
  files: FileItemProps[];
}

export function FileGrid({ files: initialFiles }: FileGridProps) {
  const { activeColor } = useMode();
  const [files, setFiles] = useState<FileItemProps[]>(initialFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const newFiles = Array.from(fileList).map((file) => ({
        name: file.name,
        type: file.type.split("/")[1],
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      }));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleAddFile = () => {
    setIsAddingFile(true);
  };

  const handleSaveNewFile = () => {
    if (newFileName && newFileContent) {
      const newFile: FileItemProps = {
        name: newFileName.endsWith(".md") ? newFileName : `${newFileName}.md`,
        type: "md",
        size: `${(newFileContent.length / 1024).toFixed(2)} KB`,
        content: newFileContent,
      };
      setFiles((prevFiles) => [...prevFiles, newFile]);
      setIsAddingFile(false);
      setNewFileName("");
      setNewFileContent("");
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-lg shadow-brutal p-4 h-[calc(100vh-250px)] overflow-y-auto">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {files.map((file, index) => (
          <FileItem key={index} {...file} />
        ))}
        <div className="flex flex-col items-center justify-center p-2">
          <button
            onClick={handleUpload}
            className="w-16 h-16 mb-2 flex items-center justify-center bg-white border-2 border-black rounded-lg shadow-brutal transition-transform hover:scale-105"
            style={{ backgroundColor: activeColor }}
          >
            <Upload className="w-8 h-8 text-white" />
          </button>
          <div className="text-sm font-medium">Upload</div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>
        <div className="flex flex-col items-center justify-center p-2">
          <button
            onClick={handleAddFile}
            className="w-16 h-16 mb-2 flex items-center justify-center bg-white border-2 border-black rounded-lg shadow-brutal transition-transform hover:scale-105"
            style={{ backgroundColor: activeColor }}
          >
            <Plus className="w-8 h-8 text-white" />
          </button>
          <div className="text-sm font-medium">Add File</div>
        </div>
      </div>
      {isAddingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-lg shadow-brutal p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Markdown File</h3>
              <button
                onClick={() => setIsAddingFile(false)}
                className="text-gray-500 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              placeholder="File name (e.g., my-notes.md)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full p-2 mb-4 border-2 border-black rounded"
            />
            <textarea
              placeholder="File content"
              value={newFileContent}
              onChange={(e) => setNewFileContent(e.target.value)}
              className="w-full p-2 mb-4 border-2 border-black rounded h-40"
            />
            <button
              onClick={handleSaveNewFile}
              className="w-full p-2 text-white rounded transition-transform hover:scale-105"
              style={{ backgroundColor: activeColor }}
            >
              Save File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
