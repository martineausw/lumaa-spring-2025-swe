import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "development") {
    devLog("clearing user table");
    await prisma.user.deleteMany();
  }
}

main()
  .catch((error) => {
    console.error(error.message);
  })
  .finally(async () => {
    await prisma.$disconnect;
  });

function devLog(...objects: any[]) {
  if (process.env.NODE_ENV !== "development") return;
  console.log("[dev]", import.meta.filename, ...objects);
}
