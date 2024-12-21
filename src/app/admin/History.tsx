"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  DocumentSnapshot,
} from "firebase/firestore";
import { fs } from "../firebaseConfig";
import { CartDetails, User } from "../Types";

const History: React.FC = () => {
  const [orders, setOrders] = useState<CartDetails[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [filter, setFilter] = useState<string>("");

  const pageSize = 10; // Number of orders per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(fs, "users"));
        const fetchedUsers = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const fetchOrders = async (nextPage: boolean = false) => {
    try {
      setLoading(true);
      const ordersRef = collection(fs, "checkouts");
      let q;

      // Check if filter is applied and status is 'completed'
      if (filter) {
        q = query(
          ordersRef,
          where("customerId", "==", filter),
          where("status", "==", "completed"), // Filter by completed status
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      } else {
        q = query(
          ordersRef,
          where("status", "==", "completed"), // Filter by completed status
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      if (nextPage && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const fetchedOrders: CartDetails[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CartDetails[];

      setOrders(nextPage ? [...orders, ...fetchedOrders] : fetchedOrders);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const loadMore = () => {
    fetchOrders(true);
  };

  return (
    <div className="mx-auto p-4 max-w-screen-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        Completed Order History
      </h2>

      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <label className="text-gray-700">Filter by User:</label>
          <select
            className="ml-2 border border-gray-300 rounded-md p-2 w-full sm:w-auto"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-lg text-gray-750">
          Loading orders...
        </div>
      ) : orders.length > 0 ? (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li
              key={order.id}
              className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg p-6"
            >
              <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <h3 className="text-lg font-bold text-gray-700">
                  Order ID: <span className="text-primary">{order.id}</span>
                </h3>
                <p className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  Status: {order.status}
                </p>
              </div>
              <div className="text-gray-600 mb-4">
                <p>
                  <span className="font-medium">User:</span>{" "}
                  {users.find((u) => u.id === order.customerId)?.name ||
                    "Unknown User"}{" "}
                  (
                  {users.find((u) => u.id === order.customerId)?.email ||
                    "Unknown Email"}
                  )
                </p>

                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {order.createdAt?.toDate().toLocaleString() || "Unknown"}
                </p>
                <p>
                  <span className="font-medium">Order No:</span>{" "}
                  {order.orderNumber}
                </p>
                <p>
                  <span className="font-medium">Table No:</span>{" "}
                  {order.tableNumber}
                </p>
              </div>

              <ul className="border-t border-gray-200 pt-4 space-y-2">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 font-bold text-primary">
                Total: ₱
                {order.items
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          No completed orders found.
        </p>
      )}

      {orders.length >= pageSize && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-primary text-black rounded-md shadow-md w-full sm:w-auto"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
