"use client";
import React, { useEffect, useState } from "react";
import { auth, fs } from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Stock from "./Stock";
import AddMenu from "./AddMenu";
import Users from "./Users";
import History from "./History";

const Page = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState("stocks");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(fs, "users", user.uid));
        if (userDoc.exists()) {
          if (userDoc.data().role === "admin") {
            setName(user.displayName || "");
            setEmail(user.email || "");
          } else {
            router.replace("/");
          }
        } else {
          toast.error("Invalid user");
          router.replace("/");
        }
      } else {
        toast.error("Invalid user");
        router.replace("/");
      }
    });
  }, [router]);

  const handleLogout = () => {
    toast.loading("Logging out...");
    auth.signOut().then(() => {
      toast.dismiss();
      toast.success("Logged out successfully");
      router.replace("/");
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setIsSidebarOpen(false); // Close sidebar on page change
  };

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      {/* Mobile Hamburger Menu */}
      <div className="lg:hidden p-4 flex items-center justify-between bg-gray-100">
        <Image src="/icon.png" width={50} height={50} alt="logo" />
        <button
          onClick={toggleSidebar}
          className="text-gray-700 focus:outline-none focus:ring"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`lg:w-1/5 lg:flex lg:flex-col lg:static fixed top-0 left-0 bg-white h-full transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-lg z-50`}
      >
        <div className="flex flex-col justify-between h-full">
          {/* Links */}
          <div className="p-4 flex flex-col gap-4 items-center lg:items-start">
            <Image src="/icon.png" width={100} height={100} alt="logo" />
            <div
              onClick={() => handlePageChange("stocks")}
              className={`flex items-center w-full gap-4 cursor-pointer p-2 rounded-xl ${
                currentPage === "stocks" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              <h1 className="font-semibold">Stocks</h1>
            </div>
            <div
              onClick={() => handlePageChange("addmenu")}
              className={`flex items-center w-full gap-4 cursor-pointer p-2 rounded-xl ${
                currentPage === "addmenu" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
              <h1 className="font-semibold">Menu</h1>
            </div>
            <div
              onClick={() => handlePageChange("users")}
              className={`flex items-center w-full gap-4 cursor-pointer p-2 rounded-xl ${
                currentPage === "users" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <h1 className="font-semibold">Users</h1>
            </div>

            {/* History */}
            <div
              onClick={() => handlePageChange("history")}
              className={`flex items-center w-full gap-4 cursor-pointer p-2 rounded-xl ${
                currentPage === "history" ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>

              <h1 className="font-semibold">Completed Orders</h1>
            </div>
          </div>
          {/* Logout */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <div className="flex flex-col">
                <p className="font-semibold text-sm capitalize">{name}</p>
                <p className="text-xs">{email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full p-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-4/5 p-4 h-screen overflow-y-scroll">
        {currentPage === "history" && <History />}
        {currentPage === "addmenu" && <AddMenu />}
        {currentPage === "stocks" && <Stock />}
        {currentPage === "users" && <Users />}
      </div>
    </div>
  );
};

export default Page;
