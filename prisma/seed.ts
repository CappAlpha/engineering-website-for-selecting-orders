import { hashSync } from "bcrypt";
import { randomUUID } from "crypto";

import { prisma } from "./prisma-client";

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generatePrice = () => randomNumber(500, 30000);

const adminId = randomUUID();

// DB seed
async function up() {
  await prisma.user.createMany({
    data: [
      {
        id: adminId,
        fullName: "Admin",
        email: "admin@test.ru",
        verified: new Date(),
        password: hashSync("admin123", 10),
        role: "ADMIN",
      },
    ],
  });

  await prisma.category.createMany({
    data: [
      {
        name: "Чертежи",
        slug: "chertezhi",
      },
      {
        name: "BIM",
        slug: "bim",
      },
      {
        name: "Геология",
        slug: "geologiya",
      },
      {
        name: "Программы на C++",
        slug: "programmy-na-c",
      },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        id: randomUUID(),
        name: "Чертёж Механизма",
        description:
          "Точный чертёж механизма по ГОСТ, выполненный в кратчайшие сроки с учётом всех стандартов.",
        price: generatePrice(),
        imageUrl: "/images/catalog/drawings/1.webp",
        categorySlug: "chertezhi",
        tags: ["Чертёж", "Быстро"],
      },
      {
        id: randomUUID(),
        name: "Чертёж Сборочной Единицы",
        description:
          "Детализированный чертёж сборочной единицы, соответствующий ГОСТ, для быстрого производства.",
        price: generatePrice(),
        imageUrl: "/images/catalog/drawings/1.webp",
        categorySlug: "chertezhi",
        tags: ["Чертёж", "Быстро"],
      },
      {
        id: randomUUID(),
        name: "Чертёж Детали Корпуса",
        description:
          "Чертёж корпуса с высокой точностью, выполнен по ГОСТ для инженерных нужд.",
        price: generatePrice(),
        imageUrl: "/images/catalog/drawings/1.webp",
        categorySlug: "chertezhi",
        tags: ["Чертёж", "Быстро"],
      },
      {
        id: randomUUID(),
        name: "Проект многоквартирного дома",
        description:
          "Полный проект жилого комплекса, разработанный по стандартам BIM в кратчайшие сроки.",
        price: generatePrice(),
        imageUrl: "/images/catalog/bim/1.webp",
        categorySlug: "bim",
        tags: ["BIM", "Быстро"],
      },
      {
        id: randomUUID(),
        name: "Проект загородного коттеджа",
        description:
          "Индивидуальный проект коттеджа с использованием BIM, выполнен быстро и качественно.",
        price: generatePrice(),
        imageUrl: "/images/catalog/bim/1.webp",
        categorySlug: "bim",
        tags: ["BIM", "Быстро"],
      },
      {
        id: randomUUID(),
        name: "Проект спортивного комплекса",
        description:
          "Проект современного спорткомплекса, разработанный по методологии BIM в сжатые сроки.",
        price: generatePrice(),
        imageUrl: "/images/catalog/bim/1.webp",
        categorySlug: "bim",
        tags: ["BIM", "Скидка"],
      },
      {
        id: randomUUID(),
        name: "Проект торгово-развлекательного центра",
        description:
          "Комплексный проект ТРЦ с применением BIM, готовый в кратчайшие сроки.",
        price: generatePrice(),
        imageUrl: "/images/catalog/bim/1.webp",
        categorySlug: "bim",
        tags: ["BIM"],
      },
      {
        id: randomUUID(),
        name: "Анализ грунта для фундамента",
        description:
          "Комплексное исследование грунта для проектирования фундамента, выполненное по стандартам в кратчайшие сроки.",
        price: generatePrice(),
        imageUrl: "/images/catalog/geology/1.webp",
        categorySlug: "geologiya",
        tags: ["Геология", "Фундамент"],
      },
      {
        id: randomUUID(),
        name: "Геологическая разведка участка",
        description:
          "Детальная геологическая разведка для строительства, проведённая быстро и профессионально.",
        price: generatePrice(),
        imageUrl: "/images/catalog/geology/1.webp",
        categorySlug: "geologiya",
        tags: ["Геология", "Разведка"],
      },
      {
        id: randomUUID(),
        name: "Исследование гидрогеологии",
        description:
          "Анализ гидрогеологических условий участка, выполненный в сжатые сроки с высокой точностью.",
        price: generatePrice(),
        imageUrl: "/images/catalog/geology/1.webp",
        categorySlug: "geologiya",
        tags: ["Гидрогеология"],
      },
      {
        id: randomUUID(),
        name: "Оценка сейсмической активности",
        description:
          "Исследование сейсмических рисков для безопасного строительства, проведённое оперативно.",
        price: generatePrice(),
        imageUrl: "/images/catalog/geology/1.webp",
        categorySlug: "geologiya",
        tags: ["Сейсмичность"],
      },
      {
        id: randomUUID(),
        name: "Расчёт конструктивных нагрузок",
        description:
          "Программа на C++ для точного расчёта нагрузок конструкций, выполненная в кратчайшие сроки.",
        price: generatePrice(),
        imageUrl: "/images/catalog/program/1.webp",
        categorySlug: "programmy-na-c",
        tags: ["Программа", "Нагрузки"],
      },
      {
        id: randomUUID(),
        name: "Оптимизация инженерных вычислений",
        description:
          "Эффективная C++ программа для оптимизации инженерных расчётов, разработанная быстро и надёжно.",
        price: generatePrice(),
        imageUrl: "/images/catalog/program/1.webp",
        categorySlug: "programmy-na-c",
        tags: ["Программа", "Оптимизация"],
      },
      {
        id: randomUUID(),
        name: "Программа для моделирования нагрузок",
        description:
          "C++ приложение для моделирования и анализа нагрузок, созданное в сжатые сроки.",
        price: generatePrice(),
        imageUrl: "/images/catalog/program/1.webp",
        categorySlug: "programmy-na-c",
        tags: ["Программа", "Моделирование"],
      },
    ],
  });
}

// DB reset
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
