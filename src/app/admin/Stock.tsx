import React, { useState, useEffect } from "react";
import { fs } from "../firebaseConfig"; // Firestore initialization
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import TopSales from "../components/TopSales";

interface MenuItem {
  id: string;
  name: string;
  stock: number;
}

const Stock = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [bulkAmount, setBulkAmount] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch menu items
  useEffect(() => {
    const menuCollection = collection(fs, "menu");
    const unsubscribe = onSnapshot(menuCollection, (snapshot) => {
      const menuData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as MenuItem)
      );
      setMenuItems(menuData);
    });

    return () => unsubscribe();
  }, []);

  // Update stock
  const updateStock = async (id: string, amount: number) => {
    const menuRef = doc(fs, "menu", id);
    const menuDoc = await getDoc(menuRef);
    const currentStock = menuDoc.data()?.stock || 0;
    const newStock = Math.max(0, currentStock + amount); // Prevent negative stock
    await updateDoc(menuRef, { stock: newStock });
  };

  // Bulk update stock
  const handleBulkUpdate = async (isIncrement: boolean) => {
    if (!selectedItem) return;
    const amount = isIncrement ? bulkAmount : -bulkAmount;
    await updateStock(selectedItem.id, amount);
    resetModal();
  };

  // Reset modal state
  const resetModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setBulkAmount(1);
  };

  // Filtered menu items
  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.stock.toString().includes(searchQuery)
  );

  // Low stock items
  const lowStockItems = menuItems.filter((item) => item.stock < 10);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Stock Management
      </h1>

      <div className="p-4">
        <div className="mb-6">
          <TopSales />
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold">Low Stock Alert</h2>
          <p className="text-sm">
            The following items are running low on stock:
          </p>
          <ul className="list-disc list-inside mt-2">
            {lowStockItems.map((item) => (
              <li key={item.id}>
                {item.name} - {item.stock} remaining
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Item</th>
              <th className="py-3 px-4 text-center font-semibold">
                Current Stock
              </th>
              <th className="py-3 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenuItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b text-gray-800 font-medium">
                  {item.name}
                </td>
                <td className="py-3 px-4 border-b text-center">{item.stock}</td>
                <td className="py-3 px-4 border-b text-right relative">
                  {/* Dropdown Menu */}
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() =>
                        setSelectedItem(
                          selectedItem?.id === item.id ? null : item
                        )
                      }
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
                    >
                      Update Stock
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 ml-1 text-gray-500 inline-block"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {selectedItem?.id === item.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg border z-10">
                        <ul className="py-1">
                          <li>
                            <button
                              onClick={() => updateStock(item.id, 1)}
                              className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-100"
                            >
                              + Add
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => updateStock(item.id, -1)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                            >
                              - Remove
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setModalOpen(true);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-100"
                            >
                              Bulk Update
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              Bulk Update Stock for {selectedItem.name}
            </h2>
            <input
              type="number"
              min="1"
              value={bulkAmount}
              onChange={(e) => setBulkAmount(Number(e.target.value))}
              className="w-full p-2 border rounded focus:outline-none focus:border-indigo-500 mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => handleBulkUpdate(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mr-2"
              >
                Add
              </button>
              <button
                onClick={() => handleBulkUpdate(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
              <button
                onClick={resetModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
