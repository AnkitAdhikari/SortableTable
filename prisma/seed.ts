import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: adapter });

const users: Prisma.UserCreateManyInput[] = [
  { id: 1, name: "Ada Lovelace", age: 36, address: "London" },
  { id: 3, name: "Grace Hopper", age: 85, address: "New York" },
  { id: 5, name: "Alan Turing", age: 41, address: "Cambridge" },
  { id: 7, name: "Linus Torvalds", age: 60, address: "Helsinki" },
];

async function main() {
  await prisma.user.createMany({ data: users, skipDuplicates: true });
  await prisma.$queryRaw`
  SELECT setval(
    pg_get_serial_sequence('"User"', 'id'),
    (SELECT MAX(id) FROM "User")
  )
`;
}

main()
  .then(() => {
    prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
