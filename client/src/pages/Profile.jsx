import { Provider, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  // const [filePerc, setFilePerc] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    try {
      const fileName = `${new Date().getTime()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from(import.meta.env.VITE_SUPABASE_BUCKET)
        .upload(fileName, file);

      if (error) {
        console.error("Error uploading file to Supabase:", error.message);
        setFileUploadError(true);
        return;
      }

      const { data: urlData, error: urlError } = supabase.storage
        .from(import.meta.env.VITE_SUPABASE_BUCKET)
        .getPublicUrl(fileName);

      if (urlError) {
        console.error(
          "Error getting public URL from Supabase:",
          urlError.message
        );
        setFileUploadError(true);
      } else {
        setFormData({ ...formData, avatar: urlData.publicUrl });
        setUploadDone(true);
        console.log(
          "File successfully uploaded to Supabase:",
          urlData.publicUrl
        );
      }
    } catch (err) {
      console.error("Unexpected error during file upload:", err);
      setFileUploadError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="self-center">
          {fileUploadError ? (
            <span className="text-sm self-center text-red-700">
              Image Upload Error! (Image size must be less than 2MB)
            </span>
          ) : uploadDone ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder={currentUser.email}
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
        <button className="bg-green-600 uppercase border p-3 rounded-lg hover: opacity-95">
          Create Listing
        </button>
        <div className="flex justify-between mt-5">
          <button className="text-red-700 bg-transparent p-3 rounded-lg hover: opacity-95 shadow-none outline-none">
            Delete Account
          </button>
          <button className="text-red-700 bg-transparent p-3 rounded-lg hover: opacity-95 shadow-none outline-none">
            Sign out
          </button>
        </div>
      </form>
    </div>
  );
}
