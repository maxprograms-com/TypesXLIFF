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
 * Example: JSON round-trip and target/@order verification
 *
 * Run with:
 *   npx ts-node docs/examples/03-json-roundtrip.ts
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    JsonToXliff,
    XliffDocument,
    XliffFile,
    XliffSegment,
    XliffSource,
    XliffTarget,
    XliffToJson,
    XliffUnit
} from "typesxliff";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);
const outputFile: string = join(__dirname, "roundtrip-output.xlf");

function collectTargetOrders(doc: XliffDocument): Array<string> {
    const values: Array<string> = [];
    for (const file of doc.getFiles()) {
        for (const entry of file.getEntries()) {
            if (!(entry instanceof XliffUnit)) {
                continue;
            }
            for (const item of entry.getItems()) {
                if (!(item instanceof XliffSegment)) {
                    continue;
                }
                const order: number | string | undefined = item.getTarget()?.getOrder();
                if (order !== undefined) {
                    values.push(String(order));
                }
            }
        }
    }
    return values;
}

const originalDoc: XliffDocument = new XliffDocument("2.1", "en", "es");
const file: XliffFile = new XliffFile("f1");
const unit: XliffUnit = new XliffUnit("u1");

const segment1: XliffSegment = new XliffSegment("s1");
const source1: XliffSource = new XliffSource();
source1.addText("Hello");
const target1: XliffTarget = new XliffTarget();
target1.addText("Hola");
target1.setOrder("1");
segment1.setSource(source1);
segment1.setTarget(target1);
unit.addSegment(segment1);

const segment2: XliffSegment = new XliffSegment("s2");
const source2: XliffSource = new XliffSource();
source2.addText("World");
const target2: XliffTarget = new XliffTarget();
target2.addText("Mundo");
target2.setOrder("2");
segment2.setSource(source2);
segment2.setTarget(target2);
unit.addSegment(segment2);

file.addUnit(unit);
originalDoc.addFile(file);

const originalOrders: Array<string> = collectTargetOrders(originalDoc);

const jsonObject: ReturnType<typeof XliffToJson.toJsonObject> = XliffToJson.toJsonObject(originalDoc);
const roundTripDoc: XliffDocument = JsonToXliff.fromJsonObject(jsonObject);
const roundTripOrders: Array<string> = collectTargetOrders(roundTripDoc);

if (JSON.stringify(originalOrders) !== JSON.stringify(roundTripOrders)) {
    console.error("Round-trip changed target/@order values.");
    console.error("Original : " + originalOrders.join(", "));
    console.error("Roundtrip: " + roundTripOrders.join(", "));
    process.exit(1);
}

roundTripDoc.writeDocument(outputFile, true);
console.log("Round-trip preserved target/@order values.");
console.log("Written to: " + outputFile);
