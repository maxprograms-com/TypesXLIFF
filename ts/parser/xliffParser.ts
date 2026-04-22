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

import { Catalog, SAXParser } from "typesxml";
import { XliffDocument } from "../models/structural/XliffDocument.js";
import { XliffContentHandler } from "./xliffContentHandler.js";

export class XliffParser {

    xliffDocument: XliffDocument | undefined;
    parser: SAXParser;
    xliffContentHandler: XliffContentHandler;

    constructor() {
        this.xliffContentHandler = new XliffContentHandler();
        this.parser = new SAXParser();
        this.parser.setContentHandler(this.xliffContentHandler);
    }

    setCatalog(catalog: Catalog): void {
        this.parser.setCatalog(catalog);
    }

    parseFile(xliffFile: string): void {
        this.parser.parseFile(xliffFile);
        this.xliffDocument = this.xliffContentHandler.getXliffDocument();
    }

    parseString(xmlText: string): void {
        this.parser.parseString(xmlText);
        this.xliffDocument = this.xliffContentHandler.getXliffDocument();
    }

    getXliffDocument(): XliffDocument | undefined {
        return this.xliffDocument;
    }

    setValidating(validating: boolean): void {
        this.parser.setValidating(validating);
    }

}