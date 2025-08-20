import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { signupSchema, loginSchema, changePasswordSchema } from "../schema/validators.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ error: "Email already registered" });
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, address: data.address, passwordHash, role: "USER" }
    });
    return res.status(201).json({ id: user.id });
  } catch (e) {
    return res.status(400).json({ error: e.errors?.[0]?.message || e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, role: user.role, id: user.id, name: user.name });
  } catch (e) {
    return res.status(400).json({ error: e.errors?.[0]?.message || e.message });
  }
});

router.post("/change-password", requireAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    res.json({ ok: true });
  } catch (e) {
    return res.status(400).json({ error: e.errors?.[0]?.message || e.message });
  }
});

export default router;
