import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UploadProjects = () => {
  const [images, setImages] = useState([]);
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

 const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  setImages((prev) => [...prev, ...files]);
};


  const handleSubmit = async () => {
  const formData = new FormData();
  formData.append("cropName", cropName);
  formData.append("quantity", quantity);
  formData.append("price", price);
  images.forEach((img) => formData.append("images", img));

  const res = await fetch("http://localhost:5000/api/projects", {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    body: formData,
  });

  const data = await res.json();
  if (res.ok) {
    alert("Product uploaded successfully!");
    navigate(`/dashboard/${role}`);
  } else {
    alert(data.message || "Upload failed");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <motion.div
        className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 border border-[rgb(164,190,123)]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-[rgb(40,84,48)] mb-6">
          Upload Your Harvest
        </h2>

        {/* Image Upload */}
        <div className="border-2 border-dashed rounded-xl p-6 mb-6 text-center cursor-pointer hover:bg-gray-100">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="imageUpload"
            onChange={handleImageUpload}
          />
          <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center gap-2">
            <Upload size={28} />
            <span className="text-sm text-gray-600">Click to upload photos</span>
          </label>
        </div>

        {/* Preview */}
        <div className="flex flex-wrap gap-3 mb-6">
            {images.map((file, i) => (
                <div key={i} className="relative">
                    <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="h-24 w-24 object-cover rounded-lg border"
                    />
                    <button
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                    >
                    <X size={14} />
                    </button>
                </div>
                ))}

        </div>

        {/* Input Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Crop Name"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[rgb(95,141,78)]"
          />
          <input
            type="number"
            placeholder="Quantity (kg)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[rgb(95,141,78)]"
          />
          <input
            type="number"
            placeholder="Rate (₹ per kg)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[rgb(95,141,78)]"
          />
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[rgb(95,141,78)] to-[rgb(40,84,48)] text-white shadow-lg hover:opacity-90"
        >
          <CheckCircle size={20} /> Submit Project
        </motion.button>
      </motion.div>
    </div>
  );
};

export default UploadProjects;
