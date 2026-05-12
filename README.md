# TypesXLIFF

TypesXLIFF is a TypeScript / Node.js library for parsing, generating, and validating XLIFF 2.x files (2.0, 2.1 and 2.2). It includes a fully typed object model and JSON conversion for processing translation and localization data.

## Quick example

Load an XLIFF file and read the first source segment:

```ts

import { XliffParser } from "typesxliff";

const parser = new XliffParser();
await parser.parseFile("file.xlf");

const doc = parser.getXliffDocument();
const segment = doc?.files[0].units[0].segments[0];

console.log(segment?.source.toString());
```

## Why TypesXLIFF

- Full XLIFF 2.x object model (not just parsing)
- Type-safe API for building and modifying documents
- JSON round-trip for integration with other systems
- Built on [TypesXML](https://github.com/rmraya/TypesXML) (streaming XML parser with validation support)

## Features

- **Parse XLIFF files** — Load an existing XLIFF 2.x file into a fully typed object model using `XliffParser`
- **Build programmatically** — Construct `XliffDocument` instances from scratch using the provided model classes
- **Write XLIFF files** — Serialize any `XliffDocument` back to a well-formed XML file using `XliffDocument.writeDocument()`
- **JSON round-trip** — Convert XLIFF ⇄ JSON (lossless) using `XliffToJson`, and reconstruct it back using `JsonToXliff`. Built on the round-trip JSON conversion provided by [TypesXML](https://github.com/rmraya/TypesXML)
- **Validate** — Each model element exposes an `isValid()` method that checks structural and semantic constraints against the XLIFF 2.x specification

## Use cases

- Parse XLIFF 2.x files in Node.js or TypeScript
- Generate XLIFF documents programmatically
- Convert XLIFF to/from JSON
- Validate XLIFF structure and content
- Build localization or translation pipelines

## Documentation

- [Getting Started](docs/getting-started.md)
- [Parsing XLIFF Files](docs/parsing.md)
- [Building XLIFF Documents](docs/building.md)
- [JSON Conversion](docs/json.md)
- [XLIFF Validation Example](https://github.com/maxprograms-com/xliff-validation) - Example project showing how to validate XLIFF files using TypesXLIFF

## Scope

TypesXLIFF provides type-safe classes for building, parsing, and serializing XLIFF documents. It covers:

- **XLIFF versions**: 2.0, 2.1 and 2.2
- **Core structural elements**: `<xliff>`, `<file>`, `<skeleton>`, `<group>`, `<unit>`, `<segment>`, `<ignorable>`, `<notes>`, `<note>`, `<originalData>`, `<data>`, `<source>` and `<target>`
- **Inline elements**: `<cp>`, `<ph>`, `<pc>`, `<sc>`, `<ec>`, `<mrk>`, `<sm>` and `<em>`
- **Metadata module**: `<metadata>`, `<metaGroup>` and `<meta>`
- **Translation Candidates module**: `<matches>` and `<match>`
- **Glossary module**: `<glossary>`, `<glossEntry>`, `<term>`, `<translation>` and `<definition>`

Each class includes validation (`isValid()`) and XML serialization (`toElement()`) methods.

### Parsing an existing XLIFF file

```typescript
import { Catalog } from "typesxml";
import { XliffParser, XliffDocument } from "typesxliff";

const parser = new XliffParser();
// Using a catalog is optional. When provided, the SAX parser can resolve grammar
// schemas and populate default attribute values declared in them.
// A sample catalog covering XLIFF 2.0, 2.1 and 2.2 is included in the catalog/ folder.
parser.setCatalog(new Catalog('/path/to/typesxliff/catalog/catalog.xml'));
parser.parseFile('/path/to/file.xlf');
const doc: XliffDocument | undefined = parser.getXliffDocument();
```

### Building and writing an XLIFF document

```typescript
import { XliffDocument, XliffFile, XliffUnit, XliffSegment, XliffSource } from "typesxliff";

const doc = new XliffDocument("2.1", "en", "es");

const file = new XliffFile("f1");
const unit = new XliffUnit("u1");
const segment = new XliffSegment("s1");
const source = new XliffSource();
source.addContent("Hello, world!");
segment.setSource(source);
unit.addItem(segment);
file.addEntry(unit);
doc.addFile(file);

doc.writeDocument('/path/to/output.xlf', true);
```

## Dependencies

- [TypesXML](https://github.com/rmraya/TypesXML) — XML object model and SAX parser
- [TypesBCP47](https://github.com/rmraya/TypesBCP47) — BCP 47 language tag utilities

## Installation

```bash
npm install typesxliff
```

## Building from Source

```bash
npm install
npm run build
```
