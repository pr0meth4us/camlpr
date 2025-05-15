import { OcrResult } from "@/types";

interface ApiResponse {
  image_paths: string[];
  ocr_results: OcrResult[];
}

export async function uploadImage(image: File): Promise<ApiResponse> {
  const form = new FormData();
  form.append("image", image);

  const res = await fetch("https://apparent-nadeen-aupp-54d2fac0.koyeb.app/api/inference", {
    method: "POST",
    body: form,
  });

  const data = await res.json();
  if (!res.ok || !data.image_paths || data.image_paths.length < 4) {
    throw new Error(data.error || "No license plate detected");
  }

  return data as ApiResponse;
}