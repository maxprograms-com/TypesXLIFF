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

import { XMLAttribute, XMLElement, XMLUtils } from "typesxml";
import type { XliffCp } from "../inline/XliffCp.js";
import { XliffElement } from "../XliffElement.js";
import type { XliffDataXmlSpace, XliffDirection } from "../XliffTypes.js";

export class XliffData implements XliffElement {

    readonly elementName: string = "data";
    id: string;
    dir?: XliffDirection;
    xmlSpace?: XliffDataXmlSpace;
    errorReason: string = '';
    readonly content: Array<string | XliffCp> = [];

    constructor(id: string) {
        this.id = id;
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getDir(): XliffDirection | undefined {
        return this.dir;
    }

    setDir(dir: XliffDirection | undefined): void {
        this.dir = dir;
    }

    getXmlSpace(): XliffDataXmlSpace | undefined {
        return this.xmlSpace;
    }

    setXmlSpace(xmlSpace: XliffDataXmlSpace | undefined): void {
        this.xmlSpace = xmlSpace;
    }

    getContent(): Array<string | XliffCp> {
        return this.content;
    }

    setContent(content: Array<string | XliffCp>): void {
        this.content.length = 0;
        this.content.push(...content);
    }

    addText(text: string): void {
        this.content.push(text);
    }

    addCp(cp: XliffCp): void {
        this.content.push(cp);
    }

    isValid(): boolean {
        if (!XMLUtils.isValidNMTOKEN(this.id)) {
            this.errorReason = 'The @id attribute value "' + this.id + '" is not a valid NMTOKEN';
            return false;
        }
        if (this.dir !== undefined && this.dir !== "auto") {
            this.errorReason = 'The @dir attribute value "' + this.dir + '" is not valid';
            return false;
        }
        if (this.xmlSpace !== undefined && this.xmlSpace !== "preserve") {
            this.errorReason = 'The @xml:space attribute value "' + this.xmlSpace + '" is not valid';
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        element.setAttribute(new XMLAttribute('id', this.id));
        if (this.dir !== undefined) {
            element.setAttribute(new XMLAttribute('dir', this.dir));
        }
        if (this.xmlSpace !== undefined) {
            element.setAttribute(new XMLAttribute('xml:space', this.xmlSpace));
        }
        for (const item of this.content) {
            if (typeof item === "string") {
                element.addString(item);
            } else {
                element.addElement(item.toElement());
            }
        }
        return element;
    }

    getValidationError(): string {
        return this.errorReason;
    }
}
