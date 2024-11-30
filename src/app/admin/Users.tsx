import React, { useEffect, useState } from "react";
import { fs } from "../firebaseConfig";
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import blankProfile from "../images/blankProfile.jpg";
import Image from "next/image";
import Select from "react-select";
import { User } from "../Types";

const options = [
  { value: "", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "super admin", label: "Super Admin" },
  { value: "cashier", label: "Cashier" },
  { value: "user", label: "User" },
  { value: "kiosk", label: "Kiosk" },
];

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const usersRef = collection(fs, "users");

    const fetchData = async () => {
      const snapshot = await getDocs(usersRef);
      const usersList = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as User)
      );

      setUsers(usersList); // Store all users
    };

    const unsubscribe = onSnapshot(usersRef, fetchData); // Real-time updates
    return () => unsubscribe();
  }, [currentPage]);

  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    const userRef = doc(fs, `users/${id}`);
    await updateDoc(userRef, { role: newRole });
    setOpenMenuId(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(searchQuery)) ||
      (user.email && user.email.toLowerCase().includes(searchQuery));
    const matchesRole = selectedRole ? user.role === selectedRole : true;
    return matchesSearch && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-4">
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-bold text-2xl">User Management</h1>
        <p className="text-gray-500 text-sm">
          Manage user accounts and their roles.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold">
          All Users ({filteredUsers.length})
        </h2>
        <div className="flex flex-wrap gap-4">
          {/* Search Input */}
          <div className="flex items-center px-3 border border-gray-300 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              className="ml-2 border-none focus:outline-none text-gray-700"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <Select
            className="w-48"
            options={options}
            onChange={(selectedOption) =>
              setSelectedRole(selectedOption?.value || "")
            }
            value={options.find((option) => option.value === selectedRole)}
          />
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">Name</th>
              <th className="p-4 text-left text-sm font-semibold">Role</th>
              <th className="p-4 text-left text-sm font-semibold">Updated</th>
              <th className="p-4 text-left text-sm font-semibold">Added</th>
              <th className="p-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 border-b last:border-0"
              >
                {/* Name & Email */}
                <td className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    {/* Profile Image */}
                    <Image
                      src={user.imageURL || blankProfile}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                      width={48}
                      height={48}
                    />
                    {/* Name and Email */}
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        {user.name}
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="p-4">
                  <span
                    className={`capitalize px-2 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                      user.role === "super admin"
                        ? "text-red-500 bg-red-50"
                        : user.role === "admin"
                        ? "text-blue-500 bg-blue-50"
                        : user.role === "cashier"
                        ? "text-green-500 bg-green-50"
                        : "text-gray-500 bg-gray-50"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* Date Updated */}
                <td className="p-4 text-sm text-gray-500">
                  {user.updatedAt?.toDate().toLocaleDateString()}
                </td>

                {/* Date Added */}
                <td className="p-4 text-sm text-gray-500">
                  {user.createdAt?.toDate().toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="p-4 relative">
                  <button
                    className="px-3 py-1 bg-gray-200 text-sm text-gray-700 rounded hover:bg-gray-300"
                    onClick={() => handleMenuToggle(user.id)}
                  >
                    Edit
                  </button>
                  {openMenuId === user.id && (
                    <div className="absolute z-10 bg-white border rounded shadow mt-2 right-0">
                      {options.slice(1).map((option) => (
                        <button
                          key={option.value}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() =>
                            handleRoleChange(user.id, option.value)
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
