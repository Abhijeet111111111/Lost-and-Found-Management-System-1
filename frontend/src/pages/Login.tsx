import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import lpulogo from "../assets/lpulogo.png";
import { useAuth } from "../context/authContext";

const BASE_URL = "http://localhost:3000";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    registrationNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "admin",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === "signup") {
      if (!formData.name.trim() || !formData.registrationNo.trim()) {
        setErrorMsg(
          "Please enter your full name and university registration number.",
        );
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
      if (formData.password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
    }

    setIsSubmitting(true);
    const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";

    try {
      const payload =
        mode === "signup"
          ? {
              name: formData.name.trim(),
              registrationNo: formData.registrationNo.trim(),
              email: formData.email.trim().toLowerCase(),
              password: formData.password,
              confirmPassword: formData.confirmPassword,
              role: formData.role,
            }
          : {
              email: formData.email.trim().toLowerCase(),
              password: formData.password,
            };

      const res = await fetch(BASE_URL + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok || data.status === "fail" || data.status === "error") {
        throw new Error(
          data.message ||
            "Authentication failed. Please check your credentials.",
        );
      }

      const token = data.token;
      const user = data.data?.user || {
        name:
          formData.name ||
          (formData.email.includes("admin") ? "Security Officer" : "Student"),
        email: formData.email,
        registrationNo: formData.registrationNo || "REG-USER",
        role:
          formData.role ||
          (formData.email.includes("admin") ? "admin" : "student"),
      };

      const finalRole =
        user.role || (mode === "signup" ? formData.role : "student");

      login(token, user);

      // if (token) {
      //   localStorage.setItem("token", token);
      // }
      localStorage.setItem("userRole", finalRole);
      // localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("storage"));

      setSuccessMsg(
        mode === "signup"
          ? "Account created successfully! Redirecting..."
          : "Signed in successfully! Redirecting...",
      );

      setTimeout(() => {
        if (finalRole === "admin") {
          navigate("/admin");
        } else {
          const prevPageLink = localStorage.getItem("prevPageLink");
          if (prevPageLink) {
            navigate(prevPageLink);
            localStorage.setItem("prevPageLink", "");
          } else {
            navigate("/");
          }
        }
      }, 500);
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || "Server connection failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ef7d00] bg-linear-to-b from-[#f37021] via-[#ef7d00] to-[#e65c00] flex flex-col justify-center py-10 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 px-4">
        <div className="inline-flex items-center justify-center bg-white p-3 rounded-2xl shadow-lg mb-3.5 border border-white/40">
          <img
            src={lpulogo}
            alt="LPU Logo"
            className="w-14 h-14 object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
          Lovely Professional University
        </h1>
        <p className="text-sm font-medium text-orange-100 mt-1 drop-shadow-xs">
          Campus Lost & Found Custody Portal
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-2xl rounded-2xl border border-white/30">
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
                mode === "login"
                  ? "border-[#ef7d00] text-[#ef7d00]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
                mode === "signup"
                  ? "border-[#ef7d00] text-[#ef7d00]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Nitin Kumar Maurya"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ef7d00] focus:border-[#ef7d00] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registration No / Staff ID
                  </label>
                  <input
                    type="text"
                    name="registrationNo"
                    required
                    value={formData.registrationNo}
                    onChange={handleChange}
                    placeholder="e.g. 12407853"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ef7d00] focus:border-[#ef7d00] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ef7d00] focus:border-[#ef7d00] focus:bg-white transition-all"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Campus Security Officer</option>
                  </select>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                University Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="student@lpu.in"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ef7d00] focus:border-[#ef7d00] focus:bg-white transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ef7d00] focus:border-[#ef7d00] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ef7d00] focus:border-[#ef7d00] focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#ef7d00] hover:bg-[#d96b00] active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl text-sm  flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-medium text-white/90 drop-shadow-xs mt-6">
          Lovely Professional University • Campus Security & Custody
          Administration
        </p>
      </div>
    </div>
  );
}
