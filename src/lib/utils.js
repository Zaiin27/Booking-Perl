import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getAddressByLocation = (location) => {
  const { address, city, state, zipCode } = location || {};
  return `${address || "Midnight Corner St."}, ${city || "Los Angles"} ${state || ""} ${zipCode || ''}`;
};
