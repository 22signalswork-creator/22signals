/**
 * Image upload helpers for the `cms-assets` Storage bucket.
 *
 * Use `uploadImage(file, "projects")` from any admin form to upload
 * a file and get back a public URL you can save in the relevant
 * table column (e.g. projects.image_url, testimonials.image_url).
 */
import { supabase } from "./supabase";

const BUCKET = "cms-assets";

/**
 * Uploads a file to the public Storage bucket and returns its public URL.
 *
 * @param file   The File object from an <input type="file"> change event.
 * @param folder Logical folder name inside the bucket (e.g. "projects",
 *               "testimonials", "blog", "team", "logos"). Used to keep
 *               files organised; not required to exist beforehand.
 */
export async function uploadImage(
  file: File,
  folder: string = "general"
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "png";
  const path = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, cacheControl: "3600" });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Deletes a previously uploaded image given its public URL.
 * Useful when replacing an image to avoid orphaned files.
 */
export async function deleteImage(url: string): Promise<void> {
  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  await supabase.storage.from(BUCKET).remove([path]);
}
