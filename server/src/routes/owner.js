import express from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Owner: see their store's average + list of raters
router.get("/dashboard", requireAuth, requireRole("STORE_OWNER"), async (req, res) => {
  const store = await prisma.store.findFirst({ where: { ownerId: req.user.id } });
  if (!store) return res.status(404).json({ error: "Store not found for this owner" });

  const [agg, raters] = await Promise.all([
    prisma.rating.aggregate({ where: { storeId: store.id }, _avg: { value: true }, _count: { value: true } }),
    prisma.rating.findMany({
      where: { storeId: store.id },
      include: { user: { select: { id: true, name: true, email: true, address: true } } },
      orderBy: { createdAt: "desc" }
    })
  ]);

  res.json({
    store: { id: store.id, name: store.name },
    averageRating: agg._avg.value || 0,
    ratingCount: agg._count.value,
    raters: raters.map(r => ({
      userId: r.userId,
      name: r.user.name,
      email: r.user.email,
      address: r.user.address,
      rating: r.value,
      ratedAt: r.createdAt
    }))
  });
});

export default router;
