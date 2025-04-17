import { Category } from "@prisma/client";

type CategoryMap = {
  [K in Category["id"]]: Category["name"];
};

//TODO: make dynamic?
export const categories = {
  1: "Чертежи",
  2: "БЭМ",
  3: "Геология",
  4: "Программы на C++",
} as const satisfies CategoryMap;
