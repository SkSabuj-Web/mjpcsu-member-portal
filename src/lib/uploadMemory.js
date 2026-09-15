import { supabase } from "./supabase";

export async function uploadMemory(file) {
  if (!file) {
    throw new Error("Please select an image.");
  }

  // 1. Create a unique file name
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;

  const filePath = `memories/photos/${fileName}`;

  // 2. Upload image to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("mjpcsu-media")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  // 3. Automatically create memories table row
  const { data: userData, error: userError } =
    await supabase.auth.getUser();
    console.log("Logged in user:", userData.user);
    console.log("User ID:", userData.user?.id);

  if (userError || !userData?.user) {
    throw new Error("User not authenticated.");
  }

  const { data, error: databaseError } = await supabase
    .from("memories")
    .insert([
      {
        title: file.name,
        description: "MJPCSU Memory",
        category: "Events",
        media_url: filePath,
        media_type: "image",
        created_by: userData.user.id,
      },
    ])
    .select()
    .single();

  if (databaseError) {
    // If database insert fails, remove uploaded image
    await supabase.storage
      .from("mjpcsu-media")
      .remove([filePath]);

    throw databaseError;
  }

  return data;
}