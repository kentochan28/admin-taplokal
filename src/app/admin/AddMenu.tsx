"use client";
import React, { useEffect, useState } from "react";
import MenuItem from "../components/MenuItem";
import { MenuItemProps, MenuItem as ItemMenu } from "../Types";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { storage, fs } from "../firebaseConfig";
import MenuModal from "../components/MenuModal";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  updateMetadata,
} from "firebase/storage";
import toast from "react-hot-toast";

// Skeleton component for loading state
const SkeletonMenuItem = () => (
  <div className="border border-gray-300 p-4 rounded-lg animate-pulse bg-gray-200">
    <div className="h-24 bg-gray-300 rounded mb-4"></div>
    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
    <div className="h-4 bg-gray-300 rounded mb-2 w-1/3"></div>
  </div>
);

const AddMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItemProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const menuRef = collection(fs, "menu");
    const docs = await getDocs(menuRef);
    const menuItemsList: MenuItemProps[] = [];
    docs.forEach((doc) =>
      menuItemsList.push({ id: doc.id, ...doc.data() } as MenuItemProps)
    );
    setMenuItems(menuItemsList);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (itemId: string) => {
    setEditItemId(itemId);
    setIsModalOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    try {
      const itemRef = doc(fs, "menu", itemId);
      await deleteDoc(itemRef);

      const cartsRef = collection(fs, "carts");
      const cartsSnapshot = await getDocs(cartsRef);
      const batch = writeBatch(fs);

      cartsSnapshot.forEach((cartDoc) => {
        const cartData = cartDoc.data();
        const updatedItems = cartData.items?.filter(
          (item: { menuItemId: string }) => item.menuItemId !== itemId
        );

        if (updatedItems) {
          batch.update(doc(fs, "carts", cartDoc.id), { items: updatedItems });
        }
      });

      await batch.commit();
      setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Menu item deleted successfully");
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Error deleting menu item");
    }
  };

  const handleSubmit = async (itemData: ItemMenu, file?: File) => {
    toast.loading("Saving changes...");
    let uploadedImageURL = itemData.imageURL;

    if (file) {
      const storageRef = ref(storage, `menuImages/${itemData.name}`);
      await uploadBytes(storageRef, file);
      await updateMetadata(storageRef, {
        cacheControl: "public,max-age=31536000",
      });
      uploadedImageURL = await getDownloadURL(storageRef);
    }

    if (editItemId) {
      const itemRef = doc(fs, "menu", editItemId);
      await setDoc(itemRef, { ...itemData, imageURL: uploadedImageURL });
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editItemId
            ? { ...item, ...itemData, imageURL: uploadedImageURL }
            : item
        )
      );
    } else {
      const newItemRef = doc(collection(fs, "menu"));
      await setDoc(newItemRef, { ...itemData, imageURL: uploadedImageURL });
      setMenuItems((prev) => [
        ...prev,
        {
          ...itemData,
          id: newItemRef.id,
          imageURL: uploadedImageURL,
          onEdit: () => handleEdit(newItemRef.id),
          onDelete: () => handleDelete(newItemRef.id),
        } as MenuItemProps,
      ]);
    }

    toast.dismiss();
    toast.success("Changes saved successfully");
    setIsModalOpen(false);
    setEditItemId(null);
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Menu Management</h1>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Search items..."
            className="flex-1 bg-transparent outline-none px-2"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Add Menu Item
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <SkeletonMenuItem key={index} />
            ))
          : filteredMenuItems.map((item) => (
              <MenuItem
                key={item.id}
                {...item}
                onEdit={() => handleEdit(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
      </div>

      <MenuModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditItemId(null);
        }}
        onSubmit={handleSubmit}
        initialData={
          editItemId
            ? menuItems.find((item) => item.id === editItemId)
            : undefined
        }
      />
    </div>
  );
};

export default AddMenu;
