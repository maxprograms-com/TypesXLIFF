# TypesXLIFF

[![npm version](https://img.shields.io/npm/v/typesxliff)](https://www.npmjs.com/package/typesxliff)
[![npm license](https://img.shields.io/npm/l/typesxliff)](LICENSE)
[![TypeScript](https://img.shields.io/badge/implementation-native%20TypeScript-3178c6)](https://www.typescriptlang.org/)

TypesXLIFF is a TypeScript / Node.js library for parsing, generating, and validating XLIFF 2.x files (2.0, 2.1 and 2.2). It includes a fully typed object model and JSON conversion for processing translation and localization data.

## Quick example

Load an XLIFF file and read the first source segment:

```ts

import { XliffParser } from "typesxliff";

const parser = new XliffParser();
parser.parseFile("file.xlf");

const doc = parser.getXliffDocument();
const segment = doc?.getFiles()?.[0]?.getEntries()?.[0];

if (segment && "getItems" in segment) {
    console.log(segment.getItems()[0]?.getSource()?.getContent().join(""));
}
```

## Why TypesXLIFF

- Full XLIFF 2.x object model (not just parsing)
- Type-safe API for building and modifying documents
- JSON round-trip for integration with other systems
- Built on [TypesXML](https://github.com/rmraya/TypesXML) (streaming XML parser with validation support)

## Features

- **Parse XLIFF files** - Load an existing XLIFF 2.x file into a fully typed object model using `XliffParser`
- **Build programmatically** - Construct `XliffDocument` instances from scratch using the provided model classes
- **Write XLIFF files** - Serialize any `XliffDocument` back to a well-formed XML file using `XliffDocument.writeDocument()`
- **JSON round-trip** - Convert XLIFF ⇄ JSON (lossless) using `XliffToJson`, and reconstruct it back using `JsonToXliff`. Built on the round-trip JSON conversion provided by [TypesXML](https://github.com/rmraya/TypesXML)
- **Validate** - Each model element exposes an `isValid()` method that checks structural and semantic constraints against the XLIFF 2.x specification

## Use cases

- Parse XLIFF 2.x files in Node.js or TypeScript
- Generate XLIFF documents programmatically
- Convert XLIFF to/from JSON
- Validate XLIFF structure and content
- Extract terminology and bilingual term pairs from XLIFF content
- Build localization or translation pipelines

## Documentation

- [Getting Started](docs/getting-started.md)
- [Parsing XLIFF Files](docs/parsing.md)
- [Building XLIFF Documents](docs/building.md)
- [JSON Conversion](docs/json.md)
- [XLIFF Validation Example](https://github.com/maxprograms-com/xliff-validation) - Companion command-line tool for strict XML Schema validation and end-to-end validation workflows. TypesXLIFF provides the object model and semantic validation methods used by that project.
- [TypesTerms](https://github.com/maxprograms-com/TypesTerms) - Companion library and command-line tool for extracting term candidates (monolingual) and bilingual translation pairs from XLIFF files using the YAKE algorithm. Built on top of TypesXLIFF for XLIFF parsing and object model access.
- [XliffDeepl](https://github.com/maxprograms-com/XliffDeepl) - Companion command-line tool that translates XLIFF 2.1/2.2 files using the DeepL API, reading `srcLang`/`trgLang` and validating them via TypesXLIFF's object model. Supports DeepL glossaries and formality settings.
- [XliffAI](https://github.com/maxprograms-com/XliffAI) - Companion command-line tool and library that translates XLIFF 2.x files with AI, batching multiple segments per request with glossary terms, TM matches, and surrounding context. Supports ChatGPT, Claude, Gemini, Ollama, Mistral, Qwen, and Z.ai through a single engine interface. Proposed translations are added as `<mtc:match>` candidates via TypesXLIFF's object model rather than overwriting `<target>`.

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
source.addText("Hello, world!");
segment.setSource(source);
unit.addSegment(segment);
file.addUnit(unit);
doc.addFile(file);

doc.writeDocument('/path/to/output.xlf', true);
```

## Dependencies

- [TypesXML](https://github.com/rmraya/TypesXML) - XML object model and SAX parser
- [TypesBCP47](https://github.com/rmraya/TypesBCP47) - BCP 47 language tag utilities

## Installation

```bash
npm install typesxliff
```

## Building from Source

```bash
npm install
npm run build
```
