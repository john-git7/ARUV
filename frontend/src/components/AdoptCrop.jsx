import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdoptCrop = () => {
  const [images, setImages] = useState([]);
  const [landSize, setLandSize] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [profitShare, setProfitShare] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // ✅ Real-time validation
  useEffect(() => {
    if (landSize !== "" && (isNaN(Number(landSize)) || Number(landSize) <= 0)) {
      toast.error("Land size must be a positive number", { autoClose: 1500 });
    }
  }, [landSize]);

  useEffect(() => {
    if (duration !== "" && (isNaN(Number(duration)) || Number(duration) <= 0)) {
      toast.error("Duration must be a positive number", { autoClose: 1500 });
    }
  }, [duration]);

  useEffect(() => {
    if (
      profitShare !== "" &&
      (isNaN(Number(profitShare)) || Number(profitShare) <= 0 || Number(profitShare) > 100)
    ) {
      toast.error("Profit share must be between 1 and 100%", { autoClose: 1500 });
    }
  }, [profitShare]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };
  
  
 const handleSubmit = async () => {
  const landSizeNum = Number(landSize);
  const durationNum = Number(duration);
  const profitShareNum = Number(profitShare);

  // ✅ Frontend validations
  if (!location || !landSize || !duration || !profitShare) {
    return toast.error("Please fill all fields!");
  }
  if (isNaN(landSizeNum) || landSizeNum <= 0) {
    return toast.error("Land size must be a positive number");
  }
  if (isNaN(durationNum) || durationNum <= 0) {
    return toast.error("Duration must be a positive number");
  }
  if (isNaN(profitShareNum) || profitShareNum <= 0 || profitShareNum > 100) {
    return toast.error("Profit share must be between 1 and 100%");
  }
  if (images.length === 0) {
    return toast.error("Please upload at least one land image!");
  }

  // ✅ Prepare FormData
  const formData = new FormData();
  formData.append("landSize", landSizeNum);
  formData.append("location", location);
  formData.append("duration", durationNum);
  formData.append("profitShare", profitShareNum);
  images.forEach((img) => formData.append("images", img));

  try {
    const res = await fetch("http://localhost:5000/api/lands", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    // ✅ Parse JSON response
    const data = await res.json();

    if (res.ok) {
      toast.success("Land uploaded successfully! 🎉");
      
      navigate(`/dashboard/${role}`);
    } 
    else if (res.status === 400) {
      // Handles duplicate land or other validation errors
      toast.error(data.message || "Validation error");
    } else {
      toast.error(data.message || "Upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Something went wrong, please try again.");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
        <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
      <motion.div
        className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 border border-[rgb(164,190,123)]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-[rgb(40,84,48)] mb-6">
          List Your Land for Rent
        </h2>

        {/* Image Upload */}
        <div className="border-2 border-dashed rounded-xl p-6 mb-6 text-center cursor-pointer hover:bg-gray-100">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="landUpload"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="landUpload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload size={28} />
            <span className="text-sm text-gray-600">
              Click to upload land photos
            </span>
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
                onClick={() =>
                  setImages(images.filter((_, idx) => idx !== i))
                }
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Input Fields */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <input
            type="number"
            placeholder="Land Size (acres)"
            value={landSize}
            onChange={(e) => setLandSize(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[rgb(95,141,78)]"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[rgb(95,141,78)]"
          />
          <input
            type="number"
            placeholder="Duration (months)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[rgb(95,141,78)]"
          />
          <input
            type="number"
            placeholder="Profit Share %"
            value={profitShare}
            onChange={(e) => setProfitShare(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[rgb(95,141,78)]"
          />
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[rgb(95,141,78)] to-[rgb(40,84,48)] text-white shadow-lg hover:opacity-90"
        >
          <CheckCircle size={20} /> List Land
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AdoptCrop;
