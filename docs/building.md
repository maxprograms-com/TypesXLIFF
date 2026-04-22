# Building XLIFF Documents

Use the model classes to construct an `XliffDocument` from scratch and write it to a file.

## Minimal Document

```typescript
import {
    XliffDocument, XliffFile, XliffUnit, XliffSegment,
    XliffSource, XliffTarget
} from "typesxliff";

// Create document: version, source language, target language
const doc = new XliffDocument("2.1", "en", "es");

// Create a file
const file = new XliffFile("f1");

// Create a unit with one segment
const unit = new XliffUnit("u1");
const segment = new XliffSegment();

const source = new XliffSource();
source.addText("Hello, world!");
segment.setSource(source);

const target = new XliffTarget();
target.addText("¡Hola, mundo!");
segment.setTarget(target);

unit.addSegment(segment);
file.addUnit(unit);
doc.addFile(file);

// Write to disk (second argument enables indentation)
doc.writeDocument('/path/to/output.xlf', true);
```

## Adding Notes

Notes can be attached to files or units in XLIFF 2.0 and 2.1. In XLIFF 2.2, notes may also be attached directly to the document (`<xliff>` element):

```typescript
import { XliffNote } from "typesxliff";

const note = new XliffNote();
note.setText("Reviewed by translator on 2026-04-11");
note.setAppliesTo("target");
unit.addNote(note);
```

## Grouping Units

Use `XliffGroup` to organize related units:

```typescript
import { XliffGroup } from "typesxliff";

const group = new XliffGroup("g1");
group.addUnit(unit);
file.addGroup(group);
```

## Segment States

Mark translation progress using segment states:

```typescript
segment.setState("translated");   // "initial" | "translated" | "reviewed" | "final"
```

## Serializing to XML Element

Instead of writing to a file, you can serialize to an `XMLElement` for further processing:

```typescript
const element = doc.toElement();
```

## Runnable Example

See [examples/02-build-document.ts](examples/02-build-document.ts) for a self-contained runnable example.
