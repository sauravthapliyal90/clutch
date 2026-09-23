// scripts/createAdmin.ts
import { prisma } from "../src/config/db.js";
import { hashPassword } from "../src/utils/hash.js";

async function main() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.error("Usage: tsx scripts/createAdmin.ts <username> <password>");
    process.exit(1);
  }

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) {
    console.error(`Admin "${username}" already exists.`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const admin = await prisma.admin.create({
    data: { username, passwordHash },
  });

  console.log(`Admin created: ${admin.username} (${admin.id})`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});