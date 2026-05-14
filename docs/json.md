# JSON Conversion

TypesXLIFF supports lossless round-trip conversion between XLIFF documents and JSON, powered by the [TypesXML](https://github.com/rmraya/TypesXML) JSON conversion API.

## Why JSON?

- Store XLIFF content in document databases (MongoDB, CouchDB, etc.)
- Transmit XLIFF over REST APIs without XML serialization overhead
- Cache parsed XLIFF documents as JSON and restore them without re-parsing
- Use standard JSON tooling for querying and transforming XLIFF content

## XLIFF to JSON

Use `XliffToJson` to convert an `XliffDocument` to JSON:

```typescript
import { XliffParser, XliffToJson } from "typesxliff";

const parser = new XliffParser();
parser.parseFile('/path/to/file.xlf');
const doc = parser.getXliffDocument()!;

// Convert to a JSON object
const json = XliffToJson.toJsonObject(doc);

// Or convert to a JSON string (with indentation)
const jsonString = XliffToJson.toJsonString(doc, 2);

// Or write directly to a .json file
await XliffToJson.toJsonFile(doc, '/path/to/output.json', 2);
```

## JSON to XLIFF

Use `JsonToXliff` to reconstruct an `XliffDocument` from JSON:

```typescript
import { JsonToXliff } from "typesxliff";

// From a JSON object
const doc = JsonToXliff.fromJsonObject(json);

// From a JSON string
const doc = JsonToXliff.fromJsonString(jsonString);

// From a .json file
const doc = await JsonToXliff.fromJsonFile('/path/to/file.json');
```

## Round-Trip Guarantee

The conversion uses TypesXML's `"roundtrip"` mode, which preserves all XML constructs including:

- Namespace declarations
- Processing instructions
- Comments
- Attribute order
- CDATA sections

This ensures that an XLIFF document converted to JSON and back produces an equivalent XML document.

## target/@order Behavior

For `target/@order`, TypesXLIFF enforces positive integer values without leading zeros.

Examples:

- Valid: `1`, `2`, `10`
- Invalid: `0`, `01`, `1abc`

When round-tripping (`XML -> JSON -> XLIFF -> XML`), valid `target/@order` values are preserved.

## Runnable Example

See [examples/03-json-roundtrip.ts](examples/03-json-roundtrip.ts) for a complete JSON round-trip flow that verifies `target/@order` values before and after reconstruction.
