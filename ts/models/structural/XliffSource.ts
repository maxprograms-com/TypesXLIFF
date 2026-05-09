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

import { XMLAttribute, XMLElement } from "typesxml";
import type { XliffCp } from "../inline/XliffCp.js";
import type { XliffEc } from "../inline/XliffEc.js";
import type { XliffEm } from "../inline/XliffEm.js";
import type { XliffMrk } from "../inline/XliffMrk.js";
import type { XliffPc } from "../inline/XliffPc.js";
import type { XliffPh } from "../inline/XliffPh.js";
import type { XliffSc } from "../inline/XliffSc.js";
import type { XliffSm } from "../inline/XliffSm.js";
import { XliffElement } from "../XliffElement.js";
import type { XliffXmlSpace } from "../XliffTypes.js";

export class XliffSource implements XliffElement {

    readonly elementName: string = "source";
    xmlLang?: string;
    xmlSpace?: XliffXmlSpace;
    errorReason: string = '';
    readonly content: Array<string | XliffCp | XliffPh | XliffPc | XliffSc | XliffEc | XliffMrk | XliffSm | XliffEm> = [];

    getXmlLang(): string | undefined {
        return this.xmlLang;
    }

    setXmlLang(xmlLang: string | undefined): void {
        this.xmlLang = xmlLang;
    }

    getXmlSpace(): XliffXmlSpace | undefined {
        return this.xmlSpace;
    }

    setXmlSpace(xmlSpace: XliffXmlSpace | undefined): void {
        this.xmlSpace = xmlSpace;
    }

    getContent(): Array<string | XliffCp | XliffPh | XliffPc | XliffSc | XliffEc | XliffMrk | XliffSm | XliffEm> {
        return this.content;
    }

    setContent(content: Array<string | XliffCp | XliffPh | XliffPc | XliffSc | XliffEc | XliffMrk | XliffSm | XliffEm>): void {
        this.content.length = 0;
        this.content.push(...content);
    }

    addText(text: string): void {
        this.content.push(text);
    }

    addCp(cp: XliffCp): void {
        this.content.push(cp);
    }

    addPh(ph: XliffPh): void {
        this.content.push(ph);
    }

    addPc(pc: XliffPc): void {
        this.content.push(pc);
    }

    addSc(sc: XliffSc): void {
        this.content.push(sc);
    }

    addEc(ec: XliffEc): void {
        this.content.push(ec);
    }

    addMrk(mrk: XliffMrk): void {
        this.content.push(mrk);
    }

    addSm(sm: XliffSm): void {
        this.content.push(sm);
    }

    addEm(em: XliffEm): void {
        this.content.push(em);
    }

    isValid(): boolean {
        if (this.xmlSpace !== undefined && !(this.xmlSpace === "preserve" || this.xmlSpace === "default")) {
            this.errorReason = 'The @xml:space attribute value "' + this.xmlSpace + '" is not valid';
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        if (this.xmlLang !== undefined) {
            element.setAttribute(new XMLAttribute('xml:lang', this.xmlLang));
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
