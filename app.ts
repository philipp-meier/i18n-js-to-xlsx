import path from "path";
import fs from "fs";
import { ResourcesDE } from "./input/Resources.de.js";
import { ResourcesEN } from "./input/Resources.en.js";
import {
  ResourcesDefinition,
  prepareTranslation,
  translationResultToXlsx,
} from "./utils.js";

const input: ResourcesDefinition[] = [
  {
    identifier: "en",
    value: ResourcesEN,
  },
  {
    identifier: "de",
    value: ResourcesDE,
  },
];

const translationResult = prepareTranslation(input);

const outputDir = "output";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const cultureIdentifiers = input.map((x) => x.identifier);
translationResultToXlsx(
  translationResult,
  cultureIdentifiers,
  path.join(outputDir, "Translations.xlsx")
);
