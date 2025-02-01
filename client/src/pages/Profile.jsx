import { Provider, useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  // const [filePerc, setFilePerc] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  //console.log(formData);

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

  const handleChange = (e) => {
    // console.log(formData);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    console.log(currentUser._id);
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart);
      const res = await fetch("/api/user/signout");
      const data = res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data.message));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          Update
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg text-center uppercase hover:opacity-95" to={"/create-listing"}>Create Listing</Link>
        {/*<button className="bg-green-700 text-white text-center uppercase p-3 rounded-lg hover: opacity-95">
          Create Listing
        </button>*/}
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated Successfully!" : ""}
      </p>
    </div>
  );
}
