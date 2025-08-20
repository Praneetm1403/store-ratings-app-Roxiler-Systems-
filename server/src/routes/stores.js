import express from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { ratingSchema } from "../schema/validators.js";

const router = express.Router();

// Public-ish list for logged-in users: includes overall rating and user's own rating
router.get("/", requireAuth, async (req, res) => {
  const { name, address, sort = "name:asc", page = "1", pageSize = "10" } = req.query;
  const [sortKey, sortDir] = sort.split(":");
  const where = {
    AND: [
      name ? { name: { contains: name, mode: "insensitive" } } : {},
      address ? { address: { contains: address, mode: "insensitive" } } : {},
    ]
  };
  const skip = (parseInt(page) - 1) * parseInt(pageSize);
  const take = parseInt(pageSize);
  const stores = await prisma.store.findMany({ where, orderBy: { [sortKey]: sortDir === "desc" ? "desc" : "asc" }, skip, take });
  const storeIds = stores.map(s => s.id);
  const [agg, myRatings] = await Promise.all([
    prisma.rating.groupBy({
      by: ["storeId"],
      where: { storeId: { in: storeIds } },
      _avg: { value: true },
      _count: { value: true }
    }),
    prisma.rating.findMany({ where: { userId: req.user.id, storeId: { in: storeIds } } })
  ]);
  const ratingMap = Object.fromEntries(agg.map(a => [a.storeId, { average: a._avg.value, count: a._count.value }]));
  const myMap = Object.fromEntries(myRatings.map(r => [r.storeId, r.value]));
  res.json({
    items: stores.map(s => ({
      id: s.id,
      name: s.name,
      address: s.address,
      overallRating: ratingMap[s.id]?.average || 0,
      overallCount: ratingMap[s.id]?.count || 0,
      myRating: myMap[s.id] || null
    }))
  });
});

// Submit or modify rating
router.post("/:storeId/rating", requireAuth, async (req, res) => {
  try {
    const { value } = ratingSchema.parse(req.body);
    const storeId = req.params.storeId;
    // Upsert the rating
    const rating = await prisma.rating.upsert({
      where: { userId_storeId: { userId: req.user.id, storeId } },
      create: { storeId, userId: req.user.id, value },
      update: { value }
    });
    res.json({ ok: true, rating });
  } catch (e) {
    res.status(400).json({ error: e.errors?.[0]?.message || e.message });
  }
});

export default router;
