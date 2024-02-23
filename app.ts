import { ResourcesDE } from "./input/Resources.de.js";
import { ResourcesEN } from "./input/Resources.en.js";
import { ResourcesDefinition, jsToXlsx, xlsxToJson } from "./utils.js";

// Input
const resDefinition: ResourcesDefinition[] = [
  {
    identifier: "en",
    value: ResourcesEN,
  },
  {
    identifier: "de",
    value: ResourcesDE,
  },
];

const outputDir = "output";
const xlsxFileName = "Translations.xlsx";
const cultureIdentifiers = resDefinition.map((x) => x.identifier);

// Transforms multiple JS objects to a single xlsx file.
await jsToXlsx(outputDir, xlsxFileName, resDefinition);

// Experimental: Transforms the xlsx file back to a JSON file for each culture identifier.
await xlsxToJson(outputDir, xlsxFileName, outputDir, cultureIdentifiers);
