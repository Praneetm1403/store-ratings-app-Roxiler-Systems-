import express from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { createUserSchema, createStoreSchema } from "../schema/validators.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Dashboard stats
router.get("/dashboard", requireAuth, requireRole("ADMIN"), async (_req, res) => {
  const [users, stores, ratings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count()
  ]);
  return res.json({ totalUsers: users, totalStores: stores, totalRatings: ratings });
});

// Create user (admin or normal or store owner)
router.post("/users", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const body = createUserSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return res.status(409).json({ error: "Email already exists" });
    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: { name: body.name, email: body.email, address: body.address, passwordHash, role: body.role }
    });
    res.status(201).json({ id: user.id });
  } catch (e) {
    res.status(400).json({ error: e.errors?.[0]?.message || e.message });
  }
});

// List users with filters and sorting
router.get("/users", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const { name, email, address, role, sort = "name:asc", page = "1", pageSize = "10" } = req.query;
  const [sortKey, sortDir] = sort.split(":");
  const where = {
    AND: [
      name ? { name: { contains: name, mode: "insensitive" } } : {},
      email ? { email: { contains: email, mode: "insensitive" } } : {},
      address ? { address: { contains: address, mode: "insensitive" } } : {},
      role ? { role } : {}
    ]
  };
  const skip = (parseInt(page) - 1) * parseInt(pageSize);
  const take = parseInt(pageSize);
  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { [sortKey]: sortDir === "desc" ? "desc" : "asc" }, skip, take }),
    prisma.user.count({ where })
  ]);
  res.json({ items, total });
});

// Get user details (if store owner, also return average rating for their store)
router.get("/users/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: "Not found" });
  let storeInfo = null;
  if (user.role === "STORE_OWNER") {
    const store = await prisma.store.findFirst({ where: { ownerId: user.id } });
    if (store) {
      const avg = await prisma.rating.aggregate({
        where: { storeId: store.id },
        _avg: { value: true },
        _count: { value: true }
      });
      storeInfo = { storeId: store.id, storeName: store.name, averageRating: avg._avg.value || 0, ratingCount: avg._count.value };
    }
  }
  res.json({ user, storeInfo });
});

// Create store
router.post("/stores", requireAuth, requireRole("ADMIN"), async (req, res) => {
  try {
    const data = createStoreSchema.parse(req.body);
    const store = await prisma.store.create({
      data: { name: data.name, email: data.email, address: data.address, ownerId: data.ownerUserId || null }
    });
    res.status(201).json({ id: store.id });
  } catch (e) {
    res.status(400).json({ error: e.errors?.[0]?.message || e.message });
  }
});

// List stores with filters + sorting, include overall rating
router.get("/stores", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const { name, email, address, sort = "name:asc", page = "1", pageSize = "10" } = req.query;
  const [sortKey, sortDir] = sort.split(":");
  const where = {
    AND: [
      name ? { name: { contains: name, mode: "insensitive" } } : {},
      email ? { email: { contains: email, mode: "insensitive" } } : {},
      address ? { address: { contains: address, mode: "insensitive" } } : {},
    ]
  };
  const skip = (parseInt(page) - 1) * parseInt(pageSize);
  const take = parseInt(pageSize);
  const stores = await prisma.store.findMany({ where, orderBy: { [sortKey]: sortDir === "desc" ? "desc" : "asc" }, skip, take });
  const storeIds = stores.map(s => s.id);
  const agg = await prisma.rating.groupBy({
    by: ["storeId"],
    where: { storeId: { in: storeIds } },
    _avg: { value: true },
    _count: { value: true }
  });
  const ratingMap = Object.fromEntries(agg.map(a => [a.storeId, { average: a._avg.value, count: a._count.value }]));
  res.json({ items: stores.map(s => ({ ...s, rating: ratingMap[s.id]?.average || 0, ratingCount: ratingMap[s.id]?.count || 0 })) });
});

export default router;
