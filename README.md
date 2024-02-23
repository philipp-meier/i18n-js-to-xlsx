# i18n-js-to-xlsx

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/philipp-meier/i18n-js-to-xlsx/blob/main/LICENSE)

Transforms multiple i18n JavaScript objects to a single xlsx file with a column for each specified language.

## Example

**Input (JavaScript object):**

```javascript
{
  Start: {
    WelcomeTitle: "Willkommen",
  },
  Navigation: {
    Previous: "Zurück",
    Next: "Weiter",
  },
  Actions: {
    Apply: "Anwenden",
    Back: "Zurück",
  },
  Questions: {
    ConfirmDeleteItem: (itemName: string): string =>
      `Sind Sie sicher, dass Sie "${itemName}" löschen möchten?`,
  },
  Loading: "Wird geladen...",
}
```

**Output (XLSX):**  
| Identifier | de | en |
|------------|----|----|
| Start.WelcomeTitle | Willkommen | Welcome |
| Navigation.Previous | Zurück | Previous |
| Navigation.Next | Weiter | Next |
| Actions.Apply | Anwenden | Apply |
| Actions.Back | Zurück | Back |
| Questions.ConfirmDeleteItem | (itemName) => `Sind Sie sicher...` | (itemName) => `Are you sure...` |
| Loading | Wird geladen... | Loading... |

## Usage

Modify the `app.ts` to include your JSON objects and run `npm run start`.  
You will find the xlsx-file in the `output`-directory that will be created automatically.

## Experimental

`i18n-js-to-xlsx` also supports transforming the generated xlsx back to a JSON object (experimental).
