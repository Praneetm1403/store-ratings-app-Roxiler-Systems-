import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash("Admin@123", 10);
  const ownerPass = await bcrypt.hash("Owner@123", 10);
  const userPass  = await bcrypt.hash("User@1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { name: "System Administrator Seed User", email: "admin@example.com", address: "Admin Street, City, Country", passwordHash: adminPass, role: "ADMIN" }
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: {},
    create: { name: "Primary Store Owner Seed User", email: "owner@example.com", address: "Owner Ave, City, Country", passwordHash: ownerPass, role: "STORE_OWNER" }
  });

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: { name: "Normal Platform User Seed", email: "user@example.com", address: "User Road, City, Country", passwordHash: userPass, role: "USER" }
  });

  const store = await prisma.store.upsert({
    where: { email: "store@example.com" },
    update: {},
    create: { name: "Example Seed Store For Demo", email: "store@example.com", address: "123 Market Street, Metropolis", ownerId: owner.id }
  });

  await prisma.rating.createMany({
    data: [
      { userId: user.id, storeId: store.id, value: 5 },
    ],
    skipDuplicates: true
  });

  console.log("Seeded: admin, owner, user, store + one rating");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
