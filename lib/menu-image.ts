const allowedLegacyImages = new Set(["lamb", "chicken", "breakfast", "drink"]);
const imageDataPattern = /^data:image\/(?:jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/;

export function normaliseMenuImage(value: unknown, fallback = "lamb") {
  const image = typeof value === "string" ? value.trim() : "";
  if (!image) return fallback;
  if (allowedLegacyImages.has(image)) return image;
  if (image.startsWith("/food/") && !image.includes("..")) return image;
  if (image.length <= 1_500_000 && imageDataPattern.test(image)) return image;
  throw new Error("صيغة الصورة غير صالحة أو حجمها كبير جدًا");
}
