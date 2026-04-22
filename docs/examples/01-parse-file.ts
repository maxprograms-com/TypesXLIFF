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

import { join } from "node:path";
import { XliffParser, XliffDocument, XliffUnit, XliffSegment } from "typesxliff";

const sampleFile = join(__dirname, "sample.xlf");

const parser = new XliffParser();
parser.parseFile(sampleFile);

const doc: XliffDocument | undefined = parser.getXliffDocument();
if (!doc) {
    console.error("Failed to parse XLIFF file.");
    process.exit(1);
}

console.log("Version     :", doc.getVersion());
console.log("Source lang :", doc.getSrcLang());
console.log("Target lang :", doc.getTrgLang() ?? "(none)");
console.log("");

for (const file of doc.getFiles()) {
    console.log("File:", file.getId());

    for (const entry of file.getEntries()) {
        if (entry instanceof XliffUnit) {
            console.log("  Unit:", entry.getId());

            for (const item of entry.getItems()) {
                if (item instanceof XliffSegment) {
                    const source = item.getSource();
                    const target = item.getTarget();
                    const state = item.getState() ?? "initial";

                    console.log("    Segment:", item.getId() ?? "(no id)");
                    console.log("      State :", state);
                    console.log("      Source:", source?.getContent().join("") ?? "");
                    console.log("      Target:", target?.getContent().join("") ?? "(untranslated)");
                }
            }
        }
    }
}
