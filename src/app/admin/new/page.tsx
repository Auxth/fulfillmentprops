"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function AddGame() {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAdd = async () => {
    if (!imageFile) return alert("กรุณาเลือกรูปภาพก่อน");

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("game-images")
      .upload(fileName, imageFile);

    if (error) {
      console.error("Upload Error", error);
      return;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/game-images/${fileName}`;

    await supabase.from("games").insert({ name, image: imageUrl });
    router.push("/games");
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">เพิ่มเกมใหม่</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ชื่อเกม"
        className="w-full mb-4 border p-2 rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full mb-4 border p-2 rounded"
      />
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-40 object-cover rounded mb-4 border"
        />
      )}
      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        เพิ่ม
      </button>
    </div>
  );
}
