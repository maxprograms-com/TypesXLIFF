/*******************************************************************************
 * Copyright (c) 2026 Maxprograms.
 *
 * This program and the accompanying materials are made available under the
 * terms of the TypesXLIFF License Agreement, which accompanies this
 * distribution and is available at: LICENSE.md
 *
 * Contributors:
 *     Maxprograms - initial API and implementation
 *******************************************************************************/

/**
 * Example: Build an XLIFF document programmatically and write it to a file
 *
 * Run with:
 *   npx ts-node docs/examples/02-build-document.ts
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    XliffDocument, XliffFile, XliffUnit, XliffSegment,
    XliffSource, XliffTarget, XliffNote
} from "typesxliff";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);
const outputFile: string = join(__dirname, "output.xlf");

// Create a document: XLIFF version, source language, target language
const doc: XliffDocument = new XliffDocument("2.1", "en", "es");

// Create a file container
const file: XliffFile = new XliffFile("f1");

// --- Unit 1: fully translated segment ---
const unit1: XliffUnit = new XliffUnit("u1");

const segment1: XliffSegment = new XliffSegment();
segment1.setState("translated");

const source1: XliffSource = new XliffSource();
source1.addText("Hello, world!");
segment1.setSource(source1);

const target1: XliffTarget = new XliffTarget();
target1.addText("¡Hola, mundo!");
segment1.setTarget(target1);

unit1.addSegment(segment1);
file.addUnit(unit1);

// --- Unit 2: untranslated segment with a note ---
const unit2: XliffUnit = new XliffUnit("u2");

const note: XliffNote = new XliffNote();
note.setText("Needs review by native speaker.");
note.setAppliesTo("target");
unit2.addNote(note);

const segment2: XliffSegment = new XliffSegment();
segment2.setState("initial");

const source2: XliffSource = new XliffSource();
source2.addText("Welcome to TypesXLIFF.");
segment2.setSource(source2);

unit2.addSegment(segment2);
file.addUnit(unit2);

// Assemble and write
doc.addFile(file);

if (!doc.isValid()) {
    console.error(doc.getValidationError());
    process.exit(1);
}

doc.writeDocument(outputFile, true);
console.log("Written to:", outputFile);
