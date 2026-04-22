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

import { jsonObjectToXmlDocument, jsonStringToXmlDocument, jsonFileToXmlDocument, JsonValue, XmlJsonDocument } from "typesxml";
import { XliffDocument } from "../models/structural/XliffDocument.js";
import { XliffParser } from "./xliffParser.js";

export class JsonToXliff {

    static fromJsonObject(json: JsonValue | XmlJsonDocument): XliffDocument {
        const xmlDoc = jsonObjectToXmlDocument(json);
        const parser = new XliffParser();
        parser.parseString(xmlDoc.toString());
        const doc: XliffDocument | undefined = parser.getXliffDocument();
        if (!doc) {
            throw new Error('Failed to reconstruct XliffDocument from JSON object.');
        }
        return doc;
    }

    static fromJsonString(jsonText: string): XliffDocument {
        const xmlDoc = jsonStringToXmlDocument(jsonText);
        const parser = new XliffParser();
        parser.parseString(xmlDoc.toString());
        const doc: XliffDocument | undefined = parser.getXliffDocument();
        if (!doc) {
            throw new Error('Failed to reconstruct XliffDocument from JSON string.');
        }
        return doc;
    }

    static async fromJsonFile(filePath: string): Promise<XliffDocument> {
        const xmlDoc = await jsonFileToXmlDocument(filePath);
        const parser = new XliffParser();
        parser.parseString(xmlDoc.toString());
        const doc: XliffDocument | undefined = parser.getXliffDocument();
        if (!doc) {
            throw new Error('Failed to reconstruct XliffDocument from JSON file: ' + filePath);
        }
        return doc;
    }
}
