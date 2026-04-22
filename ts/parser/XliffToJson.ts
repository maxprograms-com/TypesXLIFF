/*** ***************************************************************************
 * Copyright (c) 2026 Maxprograms.
 *
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse License 1.0
 * which accompanies this distribution, and is available at
 * https://www.eclipse.org/org/documents/epl-v10.html
 *
 * Contributors:
 *     Maxprograms - initial API and implementation
 *************************************************************************** ***/

import { xmlDocumentToJsonObject, xmlDocumentToJsonFile, XmlJsonDocument } from "typesxml";
import { XliffDocument } from "../models/structural/XliffDocument.js";

export class XliffToJson {

    static toJsonObject(doc: XliffDocument): XmlJsonDocument {
        return xmlDocumentToJsonObject(doc.toXMLDocument(), { mode: "roundtrip" });
    }

    static toJsonString(doc: XliffDocument, indent?: number): string {
        const json: XmlJsonDocument = XliffToJson.toJsonObject(doc);
        return JSON.stringify(json, null, indent);
    }

    static async toJsonFile(doc: XliffDocument, filePath: string, indent?: number): Promise<void> {
        await xmlDocumentToJsonFile(doc.toXMLDocument(), filePath, indent, "utf-8", { mode: "roundtrip" });
    }
}
