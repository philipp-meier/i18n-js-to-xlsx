import { flatten } from "flat";
import { IResources } from "./input/Resources";
import ExcelJS from "exceljs";

export type ResourcesDefinition = {
  identifier: string;
  value: IResources;
};

export type TranslationResult = Record<string, {}>;

export function prepareTranslation(
  resources: ResourcesDefinition[]
): TranslationResult {
  // Merge all language resources together to get all available translation keys.
  let merged = {};
  resources.forEach((i) => Object.assign(merged, i.value));

  // Navigate through the flattened object keys and resolves the value.
  const resolveTranslationValue = (
    obj: {},
    key: string,
    index = 0
  ): string | null => {
    if (key in obj) return obj[key];

    const splittedKey = key.split(".");
    if (index < splittedKey.length && splittedKey[index] in obj) {
      const value = obj[splittedKey[index]];
      if (typeof value === "object")
        return resolveTranslationValue(value, key, ++index);

      return value;
    }

    return null;
  };

  // Remove the values and get the unique keys over all resources.
  const uniqueTranslationKeys = Object.keys(flatten(merged));

  // Creates a dictionary with the translationKey as key and a translation object (e.g., { en: "", de: "", ... }) for the translations.
  let translationResult = {};
  uniqueTranslationKeys.forEach((translationKey) => {
    resources.forEach((translation) => {
      const cultureIdentifier = translation.identifier;

      const value = resolveTranslationValue(translation.value, translationKey);
      if (value) {
        if (!(translationKey in translationResult))
          translationResult[translationKey] = {};
        translationResult[translationKey][cultureIdentifier] = value.toString();
      }
    });
  });

  return translationResult;
}

export function translationResultToXlsx(
  translations: TranslationResult,
  cultureIdentifiers: string[],
  fileName: string
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Translations");

  // Headline
  const headlines = ["Identifier", ...cultureIdentifiers];
  const headlineRow = sheet.getRow(1);

  let headlineColumnIndex = 1;
  headlines.forEach((headline) => {
    const cell = headlineRow.getCell(headlineColumnIndex);
    cell.style = { font: { bold: true } };
    cell.value = headline;

    headlineColumnIndex++;
  });

  // Content
  let rowIndex = 2;
  Object.keys(translations).forEach((translationKey) => {
    const row = sheet.getRow(rowIndex);

    let columnIndex = 1;
    row.getCell(columnIndex++).value = translationKey;

    cultureIdentifiers.forEach((identifier) => {
      if (identifier in translations[translationKey])
        row.getCell(columnIndex).value =
          translations[translationKey][identifier];

      columnIndex++;
    });

    rowIndex++;
  });

  workbook.xlsx.writeFile(fileName);
}
