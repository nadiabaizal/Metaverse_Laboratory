import axios from "axios";
import { Platform } from "react-native";

/**
 * GANTI IP ini dengan IP laptop kamu saat pakai HP fisik (Expo Go).
 * Contoh: "192.168.1.10"
 */
const LAN_IP = "192.168.1.10";
const PORT = 4000;

// iOS Simulator bisa pakai localhost, Android Emulator pakai 10.0.2.2, HP fisik pakai IP LAN
export const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:" + PORT
    : "http://localhost:" + PORT;

// Kalau pakai HP fisik, override dengan IP LAN:
export const API_BASE_URL_DEVICE = `http://${LAN_IP}:${PORT}`;

export const api = axios.create({
  baseURL: API_BASE_URL_DEVICE, // <-- default untuk HP fisik
  timeout: 15000,
});

export function setAuthToken(token) {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : "";
}
