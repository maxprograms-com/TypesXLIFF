# Getting Started with TypesXLIFF

TypesXLIFF is a TypeScript library for creating, parsing, and writing XLIFF 2.x documents.

## Requirements

- Node.js 24.14.0 or later
- TypeScript 6.x or later

## Installation

```bash
npm install typesxliff
```

## Supported XLIFF Versions

| Version | Status |
| ------- | ------ |
| XLIFF 2.0 | Supported |
| XLIFF 2.1 | Supported |
| XLIFF 2.2 | Supported |

## Core Concepts

### Document Model

An XLIFF document is structured as follows:

``` code
XliffDocument
└── XliffFile (one or more)
    └── XliffUnit | XliffGroup (one or more)
        └── XliffSegment | XliffIgnorable (one or more)
            ├── XliffSource
            └── XliffTarget (optional)
```

### Modules

TypesXLIFF supports the following XLIFF 2.x modules:

- **Metadata** — `XliffMetadata`, `XliffMetaGroup`, `XliffMeta`
- **Translation Candidates** — `XliffMatches`, `XliffMatch`
- **Glossary** — `XliffGlossary`, `XliffGlossEntry`, `XliffTerm`, `XliffTranslation`, `XliffDefinition`

### Inline Elements

Inline markup within source and target content is represented with:
`XliffCp`, `XliffPh`, `XliffPc`, `XliffSc`, `XliffEc`, `XliffMrk`, `XliffSm`, `XliffEm`

## Next Steps

Start by parsing an existing XLIFF file:

- [Parsing an existing XLIFF file](parsing.md)

Then explore how to build documents programmatically:
  
- [Building an XLIFF document programmatically](building.md)

For integration scenarios:

- [JSON round-trip conversion](json.md)
