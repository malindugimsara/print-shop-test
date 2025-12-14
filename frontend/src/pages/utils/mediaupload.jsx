import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default async function mediaUpload(file) {
  if (!file) throw new Error("File is null or undefined");

  const fileName = `${Date.now()}-${file.name}`;

  // Upload file
  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload failed:", error);
    throw error;
  }

  // Get public URL
  const { data: publicData, error: urlError } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  if (urlError) {
    console.error("Get public URL failed:", urlError);
    throw urlError;
  }

  return publicData.publicUrl;
}
