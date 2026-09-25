import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { PublicItemDTO } from "../types";
import { AlertCircle, ShieldCheck } from "lucide-react";
import Button from "../Components/Button";
import { useAuth } from "../context/authContext";

const BASE_URL = "http://localhost:3000";

export default function Claim() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<PublicItemDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetch(`${BASE_URL}/api/items?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const token = localStorage.getItem("token");
    const data = {
      itemId: id,
      studentRegNo: formData.get("contact"),
      challengeAnswer: formData.get("verification"),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert(
          "Claim submitted successfully! Security will review your verification answers.",
        );
        navigate("/");
      } else {
        alert("Failed to submit claim");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!item)
    return <div className="p-20 text-center text-red-500">Item not found</div>;

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black mb-1 tracking-tight text-slate-900">
          Claim Ownership
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Submit a verification challenge to prove ownership of this item.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          <div className="w-full md:w-1/3 space-y-4 order-2 md:order-1">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Item Summary
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">
                    Title
                  </span>
                  <span className="font-semibold text-slate-900">
                    {item.itemName}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">
                    Category
                  </span>
                  <span className="font-semibold text-slate-900">
                    {item.category}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">
                    Found Location
                  </span>
                  <span className="font-semibold text-slate-900">
                    {item.location}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">
                    Date Found
                  </span>
                  <span className="font-semibold text-slate-900">
                    {new Date(item.incidentDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-amber-800 leading-relaxed">
                False claims are a violation of the campus honor code. Security
                personnel review all verification responses.
              </p>
            </div>
          </div>

          <div className="w-full md:w-2/3 order-1 md:order-2">
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <ShieldCheck className="w-6 h-6 text-[#ef7d00]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                    Verification Challenge
                  </h2>
                  <p className="text-xs text-slate-500">
                    Answer the questions to prove this is yours.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      name="name"
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-[#ef7d00] outline-none"
                      defaultValue={user?.name}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Student / Staff ID *
                    </label>
                    <input
                      required
                      name="contact"
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-[#ef7d00] outline-none"
                      defaultValue={user?.registrationNo}
                    />
                  </div>
                </div>

                <div className="bg-orange-50 p-5 rounded-lg border border-orange-100">
                  <label className="block text-sm font-bold text-orange-900 mb-2">
                    Please describe identifying features of this item that were
                    NOT mentioned in the public description:
                  </label>
                  <p className="text-xs text-orange-700 mb-4 italic">
                    Example: "There's a scratch near the charging port", "The
                    wallpaper is a picture of my dog, Buster", "Inside the
                    wallet is a red gym card".
                  </p>
                  <textarea
                    required
                    name="verification"
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-orange-200 rounded focus:ring-2 focus:ring-[#ef7d00] outline-none bg-white"
                    placeholder="Provide detailed, specific information here..."
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting
                      ? "Submitting Request..."
                      : "Submit Claim Request"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
