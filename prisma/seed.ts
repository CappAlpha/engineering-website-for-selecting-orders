import { prisma } from "./prisma-client";
import { v4 as uuidv4 } from "uuid";
import { hashSync } from "bcrypt";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// const openrouter = createOpenRouter({
//   apiKey: process.env.OPENROUTER_API_KEY || '',
// });

// const model = openrouter.languageModel('deepseek/deepseek-r1');

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generatePrice = () => randomNumber(190, 4600);

//Автогенерация базы данных
async function up() {
  await prisma.user.createMany({
    data: [
      {
        id: uuidv4(),
        fullName: "User",
        email: "user@test.ru",
        password: hashSync("user123", 10),
        role: "USER",
      },
      {
        id: uuidv4(),
        fullName: "Admin",
        email: "admin@test.ru",
        password: hashSync("admin123", 10),
        role: "ADMIN",
      },
    ],
  });

  await prisma.category.createMany({
    data: [
      {
        name: 'Чертежи'
      },
      {
        name: 'БЭМ'
      },
      {
        name: 'Геология'
      },
      {
        name: 'Программы на C++'
      },
    ]
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Чертёж Детали",
        description: "В кратчайшие сроки по ГОСТу",
        price: generatePrice(),
        imageUrl: "/images/catalog/1.jpeg",
        categoryId: 1,
      },
      {
        name: "Чертёж Мост",
        description: "В кратчайшие сроки по ГОСТу",
        price: generatePrice(),
        imageUrl: "/images/catalog/1.webp",
        categoryId: 1,
      },
      {
        name: "Чертёж Здания",
        description: "В кратчайшие сроки по ГОСТу",
        price: generatePrice(),
        imageUrl: "/images/catalog/1.webp",
        categoryId: 1,
      },
      {
        name: "Начерт",
        description: "В кратчайшие сроки",
        price: generatePrice(),
        imageUrl: "/images/catalog/1.webp",
        categoryId: 1,
      },
      {
        name: "Проект жилого здания",
        description: "В кратчайшие сроки",
        price: generatePrice(),
        imageUrl: "/images/catalog/1.webp",
        categoryId: 2,
      },
      {
        name: "Проект коттеджа",
        description: "В кратчайшие сроки",
        price: generatePrice(),
        imageUrl: "/images/catalog/1.webp",
        categoryId: 2,
      },
    ]
  });
}

//Автоочистка базы данных
async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
}

async function main() {
  await down();
  await up();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
