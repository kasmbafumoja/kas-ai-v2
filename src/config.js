const fallbackApiUrl = "https://wormgptn-i6n8.vercel.app/api/chat";

export const API_URL =
  (import.meta.env.VITE_API_URL || fallbackApiUrl).trim();

export const APP_NAME = "KAS AI";
export const APP_SUBTITLE = "L'ÉVEIL";
export const MAX_MESSAGE_LENGTH = 6000;
