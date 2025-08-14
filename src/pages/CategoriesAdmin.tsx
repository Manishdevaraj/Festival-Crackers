// src/pages/ManageCategories.tsx
//@ts-nocheck
import { useEffect, useState } from "react";
import {
  ref as dbRef,
  set,
  remove,
  update,
  ref,
  onValue,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { database, storage } from "@/Services/Firebase.config.js"; // storage added
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "../components/ui/card";

const ManageCategories = () => {
  const [categories, setCategories] = useState<Record<string, any>>({});
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const CategoriesRef = ref(database, "FC/GeneralMaster/Product Group");
    return onValue(CategoriesRef, (snapshot) => {
      setCategories(snapshot.val() || {});
    });
  }, []);

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const fileRef = storageRef(storage, `category_images/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setImageUrl(url);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!imageUrl) return;
    try {
      const filePath = imageUrl.split("%2F")[1].split("?")[0]; // extract file path from URL
      const fileRef = storageRef(storage, `category_images/${filePath}`);
      await deleteObject(fileRef);
      setImageUrl("");
      toast.success("Image removed!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove image");
    }
  };

  const handleSave = async () => {
    if (!categoryName.trim()) return toast.error("Enter a valid category name");
    setLoading(true);

    try {
      if (editId) {
        await update(
          dbRef(database, `FC/GeneralMaster/Product Group/${editId}`),
          {
            generalName: categoryName,
            imageUrl: imageUrl || "",
          }
        );
        toast.success("Category updated!");
      } else {
        const newId = Date.now().toString();
        await set(dbRef(database, `FC/GeneralMaster/Product Group/${newId}`), {
          id: newId,
          generalName: categoryName,
          genType: "Product Group",
          generalCode: 0,
          companyID: "FC",
          imageUrl: imageUrl || "",
        });
        toast.success("Category created!");
      }
      setCategoryName("");
      setImageUrl("");
      setEditId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string, name: string, img: string) => {
    setEditId(id);
    setCategoryName(name);
    setImageUrl(img || "");
  };

  const handleDelete = async (id: string, imgUrl?: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      if (imgUrl) {
        const filePath = imgUrl.split("%2F")[1].split("?")[0];
        const fileRef = storageRef(storage, `category_images/${filePath}`);
        await deleteObject(fileRef);
      }
      await remove(dbRef(database, `FC/GeneralMaster/Product Group/${id}`));
      toast.success("Category deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>

      <div className="flex flex-col gap-2 mb-4">
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files?.[0])}
        />

        {uploading && <span className="text-sm text-gray-500">Uploading...</span>}

        {imageUrl && (
          <div className="flex items-center gap-2 mt-2">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-20 h-20 object-cover rounded border"
            />
            <Button variant="destructive" size="sm" onClick={handleRemoveImage}>
              Remove
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={loading || uploading}>
            {editId ? "Update" : "Add"}
          </Button>
          {editId && (
            <Button
              variant="ghost"
              onClick={() => {
                setEditId(null);
                setCategoryName("");
                setImageUrl("");
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        {Object.entries(categories).map(([id, cat]) => (
          <Card key={id} className="p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {cat.imageUrl && (
                <img
                  src={cat.imageUrl}
                  alt={cat.generalName}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <span className="text-gray-800">{cat.generalName}</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() =>
                  handleEdit(id, cat.generalName, cat.imageUrl || "")
                }
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(id, cat.imageUrl)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageCategories;
