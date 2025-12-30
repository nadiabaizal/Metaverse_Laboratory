import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prismaPkg from "@prisma/client";
const { PrismaClient } = prismaPkg;
import { z } from "zod";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
}

function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function randomOTP() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// ====== AUTH ======

app.post("/auth/register/request-otp", async (req, res) => {
  const body = z.object({ email: z.string().email() }).parse(req.body);

  // pastikan user ada (pre-create)
  const user = await prisma.user.upsert({
    where: { email: body.email },
    create: { email: body.email },
    update: {},
  });

  const code = randomOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.otp.create({
    data: { email: body.email, code, mode: "register", expiresAt, userId: user.id },
  });

  // TODO: kirim email beneran. Untuk dev: log di console
  console.log("[OTP REGISTER]", body.email, code);

  res.json({ ok: true, message: "OTP sent" });
});

app.post("/auth/forgot/request-otp", async (req, res) => {
  const body = z.object({ email: z.string().email() }).parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) return res.status(404).json({ message: "Email not registered" });

  const code = randomOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.otp.create({
    data: { email: body.email, code, mode: "reset", expiresAt, userId: user.id },
  });

  console.log("[OTP RESET]", body.email, code);

  res.json({ ok: true, message: "OTP sent" });
});

app.post("/auth/otp/verify", async (req, res) => {
  const body = z.object({
    email: z.string().email(),
    code: z.string().length(4),
    mode: z.enum(["register", "reset"]),
  }).parse(req.body);

  const otp = await prisma.otp.findFirst({
    where: {
      email: body.email,
      code: body.code,
      mode: body.mode,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return res.status(400).json({ message: "OTP invalid/expired" });

  await prisma.otp.update({ where: { id: otp.id }, data: { used: true } });

  // resetToken sementara (JWT pendek)
  const resetToken = jwt.sign(
    { email: body.email, mode: body.mode, otpId: otp.id },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.json({ ok: true, resetToken });
});

app.post("/auth/register/set-password", async (req, res) => {
  const body = z.object({
    email: z.string().email(),
    resetToken: z.string(),
    password: z.string().min(8),
  }).parse(req.body);

  try {
    const payload = jwt.verify(body.resetToken, JWT_SECRET);
    if (payload.email !== body.email || payload.mode !== "register") {
      return res.status(400).json({ message: "Invalid reset token" });
    }
  } catch {
    return res.status(400).json({ message: "Reset token expired" });
  }

  const hash = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.update({
    where: { email: body.email },
    data: { passwordHash: hash },
  });

  const token = signToken(user);
  res.json({ ok: true, token, user: { email: user.email, profileCompleted: user.profileCompleted } });
});

app.post("/auth/forgot/set-new-password", async (req, res) => {
  const body = z.object({
    email: z.string().email(),
    resetToken: z.string(),
    password: z.string().min(8),
  }).parse(req.body);

  try {
    const payload = jwt.verify(body.resetToken, JWT_SECRET);
    if (payload.email !== body.email || payload.mode !== "reset") {
      return res.status(400).json({ message: "Invalid reset token" });
    }
  } catch {
    return res.status(400).json({ message: "Reset token expired" });
  }

  const hash = await bcrypt.hash(body.password, 10);

  await prisma.user.update({
    where: { email: body.email },
    data: { passwordHash: hash },
  });

  res.json({ ok: true });
});

app.post("/auth/login", async (req, res) => {
  const body = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }).parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user || !user.passwordHash) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(body.password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = signToken(user);
  res.json({ ok: true, token, user: { email: user.email, profileCompleted: user.profileCompleted } });
});

// ====== PROFILE ======

app.post("/me/profile", auth, async (req, res) => {
  const body = z.object({
    fullName: z.string().min(2),
    nik: z.string().min(8).max(32),
    birthDate: z.string().min(4),
    address: z.string().max(100).optional(),
  }).parse(req.body);

  const userId = req.user.sub;

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...body,
      profileCompleted: true,
    },
  });

  res.json({ ok: true });
});

app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(4000, () => console.log("API running on http://localhost:4000"));
