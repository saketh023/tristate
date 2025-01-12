import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={currentUser.avatar}
          alt="profile"
        />
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
