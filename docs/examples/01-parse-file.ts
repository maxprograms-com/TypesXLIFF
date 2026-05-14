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
 * Example: Parse an existing XLIFF file
 *
 * Run with:
 *   npx ts-node docs/examples/01-parse-file.ts
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { XliffParser, XliffDocument, XliffUnit, XliffSegment } from "typesxliff";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);
const sampleFile: string = join(__dirname, "sample.xlf");

const parser: XliffParser = new XliffParser();
parser.parseFile(sampleFile);

const doc: XliffDocument | undefined = parser.getXliffDocument();
if (!doc) {
    console.error("Failed to parse XLIFF file.");
    process.exit(1);
    throw new Error("Failed to parse XLIFF file.");
}
const parsedDoc: XliffDocument = doc;

console.log("Version     :", parsedDoc.getVersion());
console.log("Source lang :", parsedDoc.getSrcLang());
console.log("Target lang :", parsedDoc.getTrgLang() ?? "(none)");
console.log("");

for (const file of parsedDoc.getFiles()) {
    console.log("File:", file.getId());

    for (const entry of file.getEntries()) {
        if (entry instanceof XliffUnit) {
            console.log("  Unit:", entry.getId());

            for (const item of entry.getItems()) {
                if (item instanceof XliffSegment) {
                    const source: ReturnType<XliffSegment["getSource"]> = item.getSource();
                    const target: ReturnType<XliffSegment["getTarget"]> = item.getTarget();
                    const state: string = item.getState() ?? "initial";

                    console.log("    Segment:", item.getId() ?? "(no id)");
                    console.log("      State :", state);
                    console.log("      Source:", source?.getContent().join("") ?? "");
                    console.log("      Target:", target?.getContent().join("") ?? "(untranslated)");
                }
            }
        }
    }
}
