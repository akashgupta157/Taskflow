import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const backend_url = import.meta.env.VITE_BACKEND_URL;
export const configure = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};