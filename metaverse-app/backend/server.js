/**
 * Metaverse backend (DEV)
 * - OTP flow + register/login like the Expo app expects
 * - Storage: in-memory (reset when server restarts)
 *
 * Endpoints used by mobile app:
 *  POST /auth/register/request-otp
 *  POST /auth/forgot/request-otp
 *  POST /auth/otp/verify
 *  POST /auth/register/set-password
 *  POST /auth/forgot/set-new-password
 *  POST /auth/login
 *
 * Additional for profile flow:
 *  POST /me/profile
 *  GET  /me
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || "0.0.0.0";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const OTP_TTL_MS = Number(process.env.OTP_TTL_MS || 5 * 60 * 1000); // 5 min
const RESET_TOKEN_TTL_MS = Number(process.env.RESET_TOKEN_TTL_MS || 10 * 60 * 1000); // 10 min
const SHOW_OTP = String(process.env.SHOW_OTP || "true").toLowerCase() === "true";

// =========================
// In-memory storage
// =========================
// users: email -> { email, passwordHash, profileCompleted, profile? }
const users = new Map();
// otps: email -> { code, mode, expiresAt }
const otps = new Map();
// resetTokens: token -> { email, mode, expiresAt }
const resetTokens = new Map();

function isValidEmail(email) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}

function genOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function genResetToken() {
  return "rt_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function signAuthToken(email) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
}

// =========================
// Auth middleware (JWT)
// =========================
function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload?.email) return res.status(401).json({ message: "Invalid token" });
    req.userEmail = payload.email;
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
}

// =========================
// Health
// =========================
app.get("/health", (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// =========================
// AUTH
// =========================

// Register: request OTP
app.post("/auth/register/request-otp", (req, res) => {
  const { email } = req.body || {};
  if (!isValidEmail(email)) return res.status(400).json({ message: "Email tidak valid" });

  const code = genOtp();
  otps.set(email, { code, mode: "register", expiresAt: Date.now() + OTP_TTL_MS });

  console.log(`[OTP] register ${email}: ${code}`);

  return res.json({ message: "OTP terkirim", ...(SHOW_OTP ? { debugOtp: code } : {}) });
});

// Forgot password: request OTP
app.post("/auth/forgot/request-otp", (req, res) => {
  const { email } = req.body || {};
  if (!isValidEmail(email)) return res.status(400).json({ message: "Email tidak valid" });
  if (!users.has(email)) return res.status(404).json({ message: "User tidak ditemukan" });

  const code = genOtp();
  otps.set(email, { code, mode: "reset", expiresAt: Date.now() + OTP_TTL_MS });

  console.log(`[OTP] reset ${email}: ${code}`);

  return res.json({ message: "OTP terkirim", ...(SHOW_OTP ? { debugOtp: code } : {}) });
});

// OTP verify (mode: register | reset)
app.post("/auth/otp/verify", (req, res) => {
  const { email, code, mode } = req.body || {};

  if (!isValidEmail(email)) return res.status(400).json({ message: "Email tidak valid" });
  if (typeof code !== "string" && typeof code !== "number")
    return res.status(400).json({ message: "Kode OTP wajib diisi" });
  if (mode !== "register" && mode !== "reset")
    return res.status(400).json({ message: "Mode tidak valid" });

  const entry = otps.get(email);
  if (!entry) return res.status(400).json({ message: "OTP tidak ditemukan. Silakan resend" });
  if (entry.mode !== mode) return res.status(400).json({ message: "Mode OTP tidak sesuai" });
  if (Date.now() > entry.expiresAt) {
    otps.delete(email);
    return res.status(400).json({ message: "OTP kadaluarsa. Silakan resend" });
  }
  if (String(entry.code) !== String(code)) return res.status(400).json({ message: "OTP salah" });

  otps.delete(email);

  const resetToken = genResetToken();
  resetTokens.set(resetToken, { email, mode, expiresAt: Date.now() + RESET_TOKEN_TTL_MS });

  return res.json({ resetToken });
});

// Register: set password
app.post("/auth/register/set-password", async (req, res) => {
  const { email, resetToken, password } = req.body || {};

  if (!isValidEmail(email)) return res.status(400).json({ message: "Email tidak valid" });
  if (!resetToken) return res.status(400).json({ message: "resetToken wajib" });
  if (typeof password !== "string" || password.length < 8)
    return res.status(400).json({ message: "Password minimal 8 karakter" });

  const rt = resetTokens.get(resetToken);
  if (!rt || rt.email !== email || rt.mode !== "register")
    return res.status(400).json({ message: "resetToken tidak valid" });
  if (Date.now() > rt.expiresAt) {
    resetTokens.delete(resetToken);
    return res.status(400).json({ message: "resetToken kadaluarsa" });
  }
  resetTokens.delete(resetToken);

  const passwordHash = await bcrypt.hash(password, 10);
  users.set(email, { email, passwordHash, profileCompleted: false });

  const token = signAuthToken(email);
  return res.json({
    token,
    user: { email, profileCompleted: false },
  });
});

// Forgot: set new password
app.post("/auth/forgot/set-new-password", async (req, res) => {
  const { email, resetToken, password } = req.body || {};

  if (!isValidEmail(email)) return res.status(400).json({ message: "Email tidak valid" });
  if (!resetToken) return res.status(400).json({ message: "resetToken wajib" });
  if (typeof password !== "string" || password.length < 8)
    return res.status(400).json({ message: "Password minimal 8 karakter" });

  const rt = resetTokens.get(resetToken);
  if (!rt || rt.email !== email || rt.mode !== "reset")
    return res.status(400).json({ message: "resetToken tidak valid" });
  if (Date.now() > rt.expiresAt) {
    resetTokens.delete(resetToken);
    return res.status(400).json({ message: "resetToken kadaluarsa" });
  }

  const u = users.get(email);
  if (!u) return res.status(404).json({ message: "User tidak ditemukan" });

  const passwordHash = await bcrypt.hash(password, 10);
  users.set(email, { ...u, passwordHash });
  resetTokens.delete(resetToken);

  return res.json({ message: "Password berhasil diubah" });
});

// Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!isValidEmail(email)) return res.status(400).json({ message: "Email tidak valid" });
  if (typeof password !== "string" || !password)
    return res.status(400).json({ message: "Password wajib" });

  const u = users.get(email);
  if (!u) return res.status(401).json({ message: "Email / password salah" });

  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) return res.status(401).json({ message: "Email / password salah" });

  const token = signAuthToken(email);
  return res.json({
    token,
    user: { email, profileCompleted: !!u.profileCompleted },
  });
});

// =========================
// ME / PROFILE (buat screen Your Profile)
// =========================

// optional: ambil data user
app.get("/me", requireAuth, (req, res) => {
  const u = users.get(req.userEmail);
  if (!u) return res.status(404).json({ message: "User tidak ditemukan" });
  return res.json({
    user: {
      email: u.email,
      profileCompleted: !!u.profileCompleted,
      profile: u.profile || null,
    },
  });
});

// simpan profile
app.post("/me/profile", requireAuth, (req, res) => {
  const email = req.userEmail; // ✅ INI YANG KURANG TADI

  const { fullName, nik, birthDate, address } = req.body || {};

  if (!fullName || !nik || !birthDate || !address) {
    return res.status(400).json({ message: "Data profile belum lengkap" });
  }

  const u = users.get(email);
  if (!u) return res.status(404).json({ message: "User tidak ditemukan" });

  const profile = { fullName, nik, birthDate, address };

  users.set(email, {
    ...u,
    profileCompleted: true,
    profile,
  });

  return res.json({
    message: "Profile saved",
    user: { email, profileCompleted: true, profile },
  });
});


// =========================
// Start server
// =========================
app.listen(PORT, HOST, () => {
  console.log(`\n✅ API running at http://${HOST}:${PORT}`);
  console.log(`✅ Health check: http://<IP-LAPTOP>:${PORT}/health`);
  console.log(`✅ SHOW_OTP=${SHOW_OTP} (DEV ONLY)`);
});
