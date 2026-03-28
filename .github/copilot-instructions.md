# Project Instructions

## File Organization for Generated Documents

When generating documents (.docx, .pptx, .xlsx) using skills:

- **Generator scripts** (.js, .py) → save to `generated/scripts/`
- **Output files** (.docx, .pptx, .xlsx) → save to `generated/output/`
- **Never save generator scripts or output files to the project root**

Example:
```
generated/
├── scripts/
│   ├── generate-quarterly-report.py
│   ├── generate-sales-deck.js
│   └── generate-budget-model.py
└── output/
    ├── quarterly-report.docx
    ├── sales-deck.pptx
    └── budget-model.xlsx
```

When running generator scripts, execute from the `generated/scripts/` directory
and write output to `generated/output/`. Use relative paths:

```python
# Python (xlsx)
wb.save('../output/report.xlsx')
```

```javascript
// Node.js (docx, pptx)
fs.writeFileSync('../output/report.docx', buffer);
// or for pptx
pres.writeFile({ fileName: '../output/deck.pptx' });
```

## npm / pip Dependencies

Install dependencies at the project root (not inside skill directories).
