import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import storeRoutes from "./routes/stores.js";
import ownerRoutes from "./routes/owner.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (_req, res) => res.json({ ok: true, service: "store-ratings-api" }));

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/stores", storeRoutes);
app.use("/owner", ownerRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
