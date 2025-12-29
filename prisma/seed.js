import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      id: "a1234567-89ab-cdef-0123-456789abcdef",
      username: "jdoe",
      password: "password123", // later vervangen door hashed, maar nu even snel seeden
      name: "John Doe",
      email: "johndoe@example.com",
      phoneNumber: "+1 555-0100",
      role: "USER",
    },
  });

  console.log("✅ Seeded minimal data");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
