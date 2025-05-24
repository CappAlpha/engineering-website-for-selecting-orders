const pluralRules = new Intl.PluralRules("ru-RU");

/**
 * Возвращает функцию выбора формы множественного числа слова.
 *
 * @example
 * let pluralizeFiles = pluralize('файл', 'файла', 'файлов');
 * console.log(`Выбрано 23 ${pluralizeFiles(23)}`) // → Выбрано 23 файла
 */
export function pluralize(
  one: string,
  few: string,
  many: string = few,
): (n: number) => string {
  const config: Record<Intl.LDMLPluralRule, string> = {
    zero: many,
    one,
    two: few,
    few,
    many,
    other: many,
  };
  return (n) => config[pluralRules.select(n)];
}
