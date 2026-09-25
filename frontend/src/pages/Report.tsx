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
<<<<<<< HEAD
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
=======
    
    // 1. Properly set the selected type ("lost" or "found")
    formData.set("type", type);

    // 2. Attach the selected image file from state if available
    if (imageFile) {
      formData.set("pictureLink", imageFile, imageFile.name);
    }

    // 3. Get the user's login token (e.g. from localStorage or cookies)
    const token = localStorage.getItem("token"); // or wherever you store your JWT
>>>>>>> 04852e9cc913c37d7586a7e9e4acafe643919326

    try {
      const res = await fetch("http://localhost:3000/api/items", {
        method: "POST",
        headers: {
          // Send token for the 'protect' middleware
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // ⚠️ Note: Do NOT add "Content-Type" here! Browser sets it automatically with the file boundary.
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Failed to submit report. Please check your inputs.");
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