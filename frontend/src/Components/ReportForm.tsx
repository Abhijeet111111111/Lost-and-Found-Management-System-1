import React from "react";
import { Upload, CheckCircle } from "lucide-react";
import Button from "./Button";

interface ReportFormProps {
  type: "lost" | "found";
  setType: (type: "lost" | "found") => void;
  isSubmitting: boolean;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ReportForm({
  type,
  setType,
  isSubmitting,
  imageFile,
  setImageFile,
  handleSubmit,
}: ReportFormProps) {
  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-xl border border-slate-200">
      <div className="flex p-1 bg-slate-100 rounded-lg mb-6 sm:mb-8">
        <button
          onClick={(e) => {
            e.preventDefault();
            setType("lost");
          }}
          className={`flex-1 py-2 text-sm font-bold rounded transition-colors cursor-pointer ${type === "lost" ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
        >
          I Lost Something
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setType("found");
          }}
          className={`flex-1 py-2 text-sm font-bold rounded transition-colors cursor-pointer ${type === "found" ? "bg-white shadow-sm text-slate-900 border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
        >
          I Found Something
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Title / Short Name *
          </label>
          <input
            required
            name="itemName"
            type="text"
            placeholder="e.g., Blue Hydroflask"
            className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#ef7d00] outline-none text-sm"
          />
        </div>
        <input type="hidden" name="user" value="6aa6dc2d1e70f57cc2511ee2" />
        <input type="hidden" name="dateFound" value={`${new Date()}`} />

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Public Description *
          </label>
          <textarea
            required
            name="publicDescription"
            rows={3}
            placeholder="Describe the item generally. Do not include sensitive or highly specific identifying details here."
            className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#ef7d00] outline-none text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Category *
            </label>
            <select
              required
              name="category"
              className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#ef7d00] outline-none bg-white text-sm"
            >
              <option value="">Select Category...</option>
              <option value="Electronics">Electronics</option>
              <option value="Keys">Keys</option>
              <option value="Wallet/ID">Wallet / ID</option>
              <option value="Personal Belongings">Personal Belongings</option>
              <option value="Clothing">Clothing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Campus Location *
            </label>
            <select
              required
              name="location"
              className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#ef7d00] outline-none bg-white text-sm"
            >
              <option value="">Select Location...</option>
              <option value="Main Library">Main Library</option>
              <option value="Cafeteria">Cafeteria</option>
              <option value="Student Union">Student Union</option>
              <option value="Science Building">Science Building</option>
              <option value="Sports Complex">Sports Complex</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Date {type === "lost" ? "Lost" : "Found"} *
          </label>
          <input
            required
            name="dateLost"
            type="date"
            className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#ef7d00] outline-none text-sm"
          />
        </div>

        {type === "found" && (
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg">
            <label className="text-xs font-bold text-orange-900 uppercase tracking-wide mb-2 flex items-center gap-2">
              Private Identifying Details
              <span className="text-[10px] bg-[#ef7d00] text-white px-2 py-0.5 rounded font-bold">
                SECURE FIELD
              </span>
            </label>
            <p className="text-xs text-orange-700 mb-3 italic">
              This information will NEVER be shown publicly. It is used to
              verify the true owner when they claim the item. (e.g., "There is a
              dent on the bottom left").
            </p>
            <textarea
              required
              name="privateDetails"
              rows={3}
              placeholder="Enter hidden details here..."
              className="w-full px-4 py-2 border border-orange-200 rounded focus:ring-2 focus:ring-[#ef7d00] outline-none bg-white text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Photo Upload
          </label>
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${imageFile ? "border-green-400 bg-green-50" : "border-slate-300 border-dashed hover:bg-slate-50"} rounded-lg transition-colors cursor-pointer bg-white relative`}
          >
            <input
              type="file"
              name="pictureLink"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) =>
                setImageFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <div className="space-y-1 text-center">
              {imageFile ? (
                <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
              ) : (
                <Upload className="mx-auto h-10 w-10 text-slate-400" />
              )}

              <div className="flex text-sm text-slate-600 justify-center font-medium">
                {imageFile ? (
                  <span className="text-green-700">
                    Selected: {imageFile.name}
                  </span>
                ) : (
                  <>
                    <span className="text-[#ef7d00] hover:text-[#d67000]">
                      Upload a file
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </>
                )}
              </div>
              {!imageFile && (
                <p className="text-xs text-slate-500">
                  EXIF Location Data will be securely stripped automatically
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting
              ? "Uploading securely..."
              : `Submit ${type === "lost" ? "Lost" : "Found"} Report`}
          </Button>
        </div>
      </form>
    </div>
  );
}
