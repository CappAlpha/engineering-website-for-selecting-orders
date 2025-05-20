import { hashSync } from "bcrypt";
import { randomUUID } from "crypto";

import { prisma } from "./prisma-client";

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generatePrice = () => randomNumber(500, 30000);

// TODO: временно добавлено так
const userId = randomUUID();
const adminId = randomUUID();
const productIdTest = randomUUID();

//Автогенерация базы данных
async function up() {
  await prisma.user.createMany({
    data: [
      {
        id: userId,
        fullName: "User",
        email: "user@test.ru",
        password: hashSync("user123", 10),
        role: "USER",
      },
      {
        id: adminId,
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
        name: "Чертежи",
      },
      {
        name: "BIM",
      },
      {
        name: "Геология",
      },
      {
        name: "Программы на C++",
      },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        id: productIdTest,
        name: "Чертёж Механизма",
        description:
          "Точный чертёж механизма по ГОСТ, выполненный в кратчайшие сроки с учётом всех стандартов.",
        price: generatePrice(),
        imageUrl: "/images/catalog/drawings/1.webp",
        categoryId: 1,
        tags: ["Чертёж", "Быстро"],
      },
      {
        id: randomUUID(),
        name: "Чертёж Сборочной Единицы",
        description:
          "Детализированный чертёж сборочной единицы, соответствующий ГОСТ, для быстрого производства.",
        price: generatePrice(),
        imageUrl: "/images/catalog/drawings/1.webp",
        categoryId: 1,
        tags: ["Чертёж", "Быстро"],
      },
      {
        id: randomUUID(),
        name: "Чертёж Детали Корпуса",
        description:
          "Чертёж корпуса с высокой точностью, выполнен по ГОСТ для инженерных нужд.",
        price: generatePrice(),
        imageUrl: "/images/catalog/drawings/1.webp",
        categoryId: 1,
        tags: ["Чертёж", "Быстро"],
      },
      {
        id: randomUUID(),
        name: "Проект многоквартирного дома",
        description:
          "Полный проект жилого комплекса, разработанный по стандартам BIM в кратчайшие сроки.",
        price: generatePrice(),
        imageUrl: "/images/catalog/bim/1.webp",
        categoryId: 2,
        tags: ["BIM", "Быстро"],
      },
      {
        id: randomUUID(),
        name: "Проект загородного коттеджа",
        description:
          "Индивидуальный проект коттеджа с использованием BIM, выполнен быстро и качественно.",
        price: generatePrice(),
        imageUrl: "/images/catalog/bim/1.webp",
        categoryId: 2,
        tags: ["BIM", "Быстро"],
      },
      {
        id: randomUUID(),
        name: "Проект спортивного комплекса",
        description:
          "Проект современного спорткомплекса, разработанный по методологии BIM в сжатые сроки.",
        price: generatePrice(),
        imageUrl: "/images/catalog/bim/1.webp",
        categoryId: 2,
        tags: ["BIM", "Скидка"],
      },
      {
        id: randomUUID(),
        name: "Проект торгово-развлекательного центра",
        description:
          "Комплексный проект ТРЦ с применением BIM, готовый в кратчайшие сроки.",
        price: generatePrice(),
        imageUrl: "/images/catalog/bim/1.webp",
        categoryId: 2,
        tags: ["BIM"],
      },
      {
        id: randomUUID(),
        name: "Анализ грунта для фундамента",
        description:
          "Комплексное исследование грунта для проектирования фундамента, выполненное по стандартам в кратчайшие сроки.",
        price: generatePrice(),
        imageUrl: "/images/catalog/geology/1.webp",
        categoryId: 3,
        tags: ["Геология", "Фундамент"],
      },
      {
        id: randomUUID(),
        name: "Геологическая разведка участка",
        description:
          "Детальная геологическая разведка для строительства, проведённая быстро и профессионально.",
        price: generatePrice(),
        imageUrl: "/images/catalog/geology/1.webp",
        categoryId: 3,
        tags: ["Геология", "Разведка"],
      },
      {
        id: randomUUID(),
        name: "Исследование гидрогеологии",
        description:
          "Анализ гидрогеологических условий участка, выполненный в сжатые сроки с высокой точностью.",
        price: generatePrice(),
        imageUrl: "/images/catalog/geology/1.webp",
        categoryId: 3,
        tags: ["Гидрогеология"],
      },
      {
        id: randomUUID(),
        name: "Оценка сейсмической активности",
        description:
          "Исследование сейсмических рисков для безопасного строительства, проведённое оперативно.",
        price: generatePrice(),
        imageUrl: "/images/catalog/geology/1.webp",
        categoryId: 3,
        tags: ["Сейсмичность"],
      },
      {
        id: randomUUID(),
        name: "Расчёт конструктивных нагрузок",
        description:
          "Программа на C++ для точного расчёта нагрузок конструкций, выполненная в кратчайшие сроки.",
        price: generatePrice(),
        imageUrl: "/images/catalog/program/1.webp",
        categoryId: 4,
        tags: ["Программа", "Нагрузки"],
      },
      {
        id: randomUUID(),
        name: "Оптимизация инженерных вычислений",
        description:
          "Эффективная C++ программа для оптимизации инженерных расчётов, разработанная быстро и надёжно.",
        price: generatePrice(),
        imageUrl: "/images/catalog/program/1.webp",
        categoryId: 4,
        tags: ["Программа", "Оптимизация"],
      },
      {
        id: randomUUID(),
        name: "Программа для моделирования нагрузок",
        description:
          "C++ приложение для моделирования и анализа нагрузок, созданное в сжатые сроки.",
        price: generatePrice(),
        imageUrl: "/images/catalog/program/1.webp",
        categoryId: 4,
        tags: ["Программа", "Моделирование"],
      },
    ],
  });
}

//Автоочистка базы данных
async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
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
