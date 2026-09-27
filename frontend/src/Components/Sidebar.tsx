// import { Outlet } from "react-router-dom";
import type { FormEvent, ReactElement } from "react";
import styles from "./Sidebar.module.css";
// import Logo from "../components/Logo";
// import AppNav from "../components/AppNav";
import ReportForm from "./ReportForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function Sidebar(): ReactElement {
  const navigate = useNavigate();
  const [type, setType] = useState<"lost" | "found">("lost");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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

    // 1. Properly set the selected type ("lost" or "found")
    formData.set("type", type);

    // 2. Attach the selected image file from state if available
    if (imageFile) {
      formData.set("pictureLink", imageFile, imageFile.name);
    }

    // 3. Get the user's login token (e.g. from localStorage or cookies)
    const token = localStorage.getItem("token"); // or wherever you store your JWT

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
        alert(
          errorData.message ||
            "Failed to submit report. Please check your inputs.",
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
    <div className={styles.sidebar}>
      {/* <Logo />
      <AppNav /> */}
      <ReportForm
        type={type}
        setType={setType}
        isSubmitting={isSubmitting}
        imageFile={imageFile}
        setImageFile={setImageFile}
        handleSubmit={handleSubmit}
      />
      {/* <Outlet />
      <div className={styles.footer}>
        <p className={styles.copyright}>Abhijeet</p>
      </div> */}
    </div>
  );
}

export default Sidebar;
