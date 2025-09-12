import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, ArrowLeft, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const Login = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: null, y: null });
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/auth/login",
          formData
        );

        localStorage.setItem("token", res.data.token);
        alert("Login successful!");
        navigate("/profile");
      } catch (err) {
        console.error("Login failed:", err.response?.data || err.message);
        setErrors({ email: "Invalid email or password" });
      }
    } else {
      setErrors(newErrors);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleCount = 100;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 1,
        dy: (Math.random() - 0.5) * 1,
      });
    }

    const handleMouseMove = (e) => {
      mouse.current.x = e.x;
      mouse.current.y = e.y;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgb(95,141,78)"; // olive green particles
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        if (mouse.current.x && mouse.current.y) {
          const distX = p.x - mouse.current.x;
          const distY = p.y - mouse.current.y;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(40,84,48,${1 - distance / 100})`; // forest green lines
            ctx.lineWidth = 2;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.current.x, mouse.current.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[rgb(79, 183, 179)] text-[rgb(40,84,48)]">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <motion.div
        className="relative z-10 max-w-md w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-[rgb(164,190,123)] hover:shadow-2xl transition-shadow duration-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-[rgb(40,84,48)]">
              Welcome Back
            </h2>
            <p className="text-[rgb(40,84,48)]/80">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="flex items-center gap-2 font-medium text-sm mb-1 text-[rgb(40,84,48)]"
              >
               <Mail size={20} className="text-[rgb(95,141,78)]/60" /> Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl bg-transparent text-black placeholder-black/60 focus:outline-none transition-colors ${
                    errors.email
                      ? "border-red-400 focus:border-red-500"
                      : "border-[rgb(95,141,78)] focus:border-[rgb(40,84,48)]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="flex items-center gap-2 font-medium text-sm mb-1 text-[rgb(40,84,48)]"
              >
                <Lock size={20} className="text-[rgb(95,141,78)]" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl bg-transparent text-black placeholder-black/60 focus:outline-none transition-colors ${
                    errors.password
                      ? "border-red-400 focus:border-red-500"
                      : "border-[rgb(95,141,78)] focus:border-[rgb(40,84,48)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[rgb(95,141,78)]/60 hover:text-[rgb(40,84,48)] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-[rgb(95,141,78)] to-[rgb(40,84,48)] hover:opacity-90 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[rgb(164,190,123)]/40"
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6 pt-6 border-t border-[rgb(164,190,123)]">
            <p className="text-[rgb(40,84,48)]/80">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-[rgb(95,141,78)] hover:text-[rgb(40,84,48)] font-semibold transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
          <br />
          <Link
          to="/"
          className="inline-flex items-center pl-30 gap-2 text-[rgb(40,84,48)] hover:text-[rgb(95,141,78)]  transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
