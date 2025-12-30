import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

const PORT = 4000;

// ambil IP dari Metro bundler (biasanya sama dengan IP laptop kamu)
function getDevHostIP() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoClient?.hostUri ??
    Constants.manifest?.hostUri;

  // hostUri contoh: "192.168.1.5:8081"
  const ip = hostUri?.split(":")?.[0];
  return ip;
}

function resolveBaseURL() {
  // kalau kamu set EXPO_PUBLIC_API_URL, ini akan dipakai
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  // Android emulator butuh 10.0.2.2 untuk akses localhost laptop
  if (Platform.OS === "android" && !getDevHostIP()) {
    return `http://10.0.2.2:${PORT}`;
  }

  // Expo Go di HP fisik: pakai IP laptop dari Metro
  const ip = getDevHostIP();
  if (ip) return `http://${ip}:${PORT}`;

  // fallback
  return `http://localhost:${PORT}`;
}

export const API_BASE_URL = resolveBaseURL();

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export function setAuthToken(token) {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : "";
}
