import { prisma } from "./prisma-client";
import { hashSync } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function up() {
  await prisma.user.createMany({
    data: [
      {
        id: uuidv4(),
        fullName: 'User',
        email: 'user@test.ru',
        password: hashSync('user123', 10),
        role: 'USER'
      },
      {
        id: uuidv4(),
        fullName: 'Admin',
        email: 'admin@test.ru',
        password: hashSync('admin123', 10),
        role: 'ADMIN'
      }
    ]
  })
}

async function down() {

}

async function main() {
  await down();
  await up();
}

main().then(async () => {
  await prisma.$disconnect();
}
).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
})