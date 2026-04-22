# Parsing XLIFF Files

Use `XliffParser` to load an existing XLIFF 2.x file into a typed object model.

## Basic Parsing

```typescript
import { XliffParser, XliffDocument } from "typesxliff";

const parser = new XliffParser();
parser.parseFile('/path/to/file.xlf');

const doc: XliffDocument | undefined = parser.getXliffDocument();
if (!doc) {
    throw new Error('Failed to parse XLIFF file');
}
```

## Parsing with a Catalog

A catalog enables the SAX parser to resolve grammar schemas and populate default attribute values declared in them. A catalog covering XLIFF 2.0, 2.1 and 2.2 is included in the `catalog/` folder.

```typescript
import { Catalog } from "typesxml";
import { XliffParser, XliffDocument } from "typesxliff";

const parser = new XliffParser();
parser.setCatalog(new Catalog('/path/to/typesxliff/catalog/catalog.xml'));
parser.parseFile('/path/to/file.xlf');

const doc: XliffDocument | undefined = parser.getXliffDocument();
```

## Navigating the Document

Once parsed, you can traverse the document tree using the typed model:

```typescript
import { XliffParser, XliffDocument, XliffFile, XliffUnit, XliffSegment } from "typesxliff";

const parser = new XliffParser();
parser.parseFile('/path/to/file.xlf');
const doc = parser.getXliffDocument()!;

console.log('Version:', doc.getVersion());
console.log('Source language:', doc.getSrcLang());
console.log('Target language:', doc.getTrgLang());

for (const file of doc.getFiles()) {
    console.log('File:', file.getId());

    for (const entry of file.getEntries()) {
        if (entry instanceof XliffUnit) {
            for (const item of entry.getItems()) {
                if (item instanceof XliffSegment) {
                    const source = item.getSource();
                    const target = item.getTarget();
                    console.log('  Source:', source?.getContent().join(''));
                    console.log('  Target:', target?.getContent().join(''));
                }
            }
        }
    }
}
```

## Validation

TypesXLIFF supports validation from XML point of view (checking against the XLIFF schema) and from a semantic point of view (checking structural correctness of the document model).

### Semantic Validation

Every model element exposes `isValid()` to check structural correctness:

```typescript
if (!doc.isValid()) {
    console.error('Document is not valid');
}
```

### XML Schema Validation

Call `setValidating(true)` before parsing to enable XML Schema validation. The parser will check the document against the XLIFF schema and report any structural violations as errors.

A catalog is required so the parser can locate the XLIFF schemas:

```typescript
import { Catalog } from "typesxml";
import { XliffParser, XliffDocument } from "typesxliff";

const parser = new XliffParser();
parser.setCatalog(new Catalog('/path/to/typesxliff/catalog/catalog.xml'));
parser.setValidating(true);
parser.parseFile('/path/to/file.xlf');

const doc: XliffDocument | undefined = parser.getXliffDocument();
```

## Runnable Example

See [examples/01-parse-file.ts](examples/01-parse-file.ts) for a self-contained runnable example.
