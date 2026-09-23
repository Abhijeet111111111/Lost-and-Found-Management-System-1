import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportForm from "../Components/ReportForm";

export default function Report() {
  const navigate = useNavigate();
  const [type, setType] = useState<"lost" | "found">("lost");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    // formData.set("type", type);

    // if (!formData.has("privateDetails")) {
    //   formData.set("privateDetails", "");
    //   formData.set("type", "lost");
    // } else {
    //   formData.set("type", "found");
    // }

    // const file = formData.get("pictureLink");
    // if (file instanceof File) {
    //   formData.set("pictureLink", file, file.name);
    // }

    formData.set("type", type);
    formData.set("privateDetails", formData.get("privateDetails") || "");

    if (imageFile) {
      formData.set("pictureLink", imageFile);
    }

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const res = await fetch("http://localhost:3000/api/items", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
      } else {
        alert(
          "Failed to submit report. Ensure your backend is running and connected.",
        );
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while communicating with the server.");
    } finally {
      setIsSubmitting(false);
      navigate("/");
    }
  };

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight text-slate-900">
            Report an Item
          </h1>
          <p className="text-slate-500 text-sm">
            Help keep our campus secure and organized.
          </p>
        </div>

        <ReportForm
          type={type}
          setType={setType}
          isSubmitting={isSubmitting}
          imageFile={imageFile}
          setImageFile={setImageFile}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
