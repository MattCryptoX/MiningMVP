import CryptoJS from "crypto-js";

export function hashId(clerkId: string): string {
  const hash = CryptoJS.SHA256(clerkId).toString(CryptoJS.enc.Hex);
  return hash.substring(0, 5);
}
