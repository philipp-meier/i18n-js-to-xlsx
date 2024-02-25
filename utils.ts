import { flatten, unflatten } from "flat";
import { IResources } from "./input/Resources";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";

export type ResourcesDefinition = {
  identifier: string;
  value: IResources;
};

export type TranslationKeyValueMapping = Record<string, {}>;

export async function jsToXlsx(
  outputDir: string,
  fileName: string,
  resDefinition: ResourcesDefinition[]
): Promise<void> {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  await transformToXlsx(resDefinition, path.join(outputDir, fileName));
}

export async function xlsxToJson(
  inputDir: string,
  inputFileName: string,
  outputDir: string,
  cultureIdentifiers: string[]
) {
  const jsObjects = await transformToJsObjects(
    path.join(inputDir, inputFileName),
    cultureIdentifiers
  );

  jsObjects.forEach((obj, index) => {
    const resFileName = `Resources${cultureIdentifiers[
      index
    ].toUpperCase()}.json`;

    const resFile = path.join(outputDir, resFileName);

    fs.writeFile(resFile, JSON.stringify(obj, null, 2), (err) => {
      if (err) {
        throw new Error(err.message);
      }
    });
  });
}

async function transformToXlsx(
  resDefinition: ResourcesDefinition[],
  fileName: string
): Promise<void> {
  const cultureIdentifiers = resDefinition.map((x) => x.identifier);
  const translations = getTranslationKeyValueMapping(resDefinition);

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

  await workbook.xlsx.writeFile(fileName);
}

function getTranslationKeyValueMapping(
  resources: ResourcesDefinition[]
): TranslationKeyValueMapping {
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

async function transformToJsObjects(
  inputFileName: string,
  cultureIdentifiers: string[]
): Promise<{}[]> {
  let cultureObjects: {}[] = [];

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(inputFileName);

  const worksheet = workbook.getWorksheet("Translations");
  const headerRow = worksheet!.getRow(1);

  cultureIdentifiers.forEach((identifier) => {
    let cultureObject = {};

    const columnOffset = 1;
    let columnIndex = -1;
    for (
      let i = 1 + columnOffset;
      i <= cultureIdentifiers.length + columnOffset;
      i++
    ) {
      if (headerRow.getCell(i).value === identifier) {
        columnIndex = i;
        break;
      }
    }

    if (columnIndex === -1) {
      throw new Error(`Culture identifier "${identifier}" not found.`);
    }

    worksheet?.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const identifier = row.getCell(1).value!.toString();
      cultureObject[identifier] = row.getCell(columnIndex).value;
    });

    cultureObjects.push(cultureObject);
  });

  return cultureObjects.map((x) => unflatten(x));
}
