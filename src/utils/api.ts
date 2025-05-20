import { PlateDetectionResponse } from "@/types";

export const uploadImage = async (image: File): Promise<PlateDetectionResponse> => {
  const form = new FormData();
  form.append("image", image);

  const res = await fetch("api/inference", {
    method: "POST",
    body: form,
  });

  const data = await res.json();
  if (!res.ok || !data.image_paths || data.image_paths.length < 4) {
    throw new Error(data.error || "No license plate detected");
  }

  return data as PlateDetectionResponse;
};