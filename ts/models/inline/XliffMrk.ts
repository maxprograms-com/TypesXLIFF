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
import { XliffElement } from "../XliffElement.js";
import { isValidFragmentIdentifier } from "../XliffFragment.js";
import type { XliffAnnotationType, XliffYesNo } from "../XliffTypes.js";
import type { XliffCp } from "./XliffCp.js";
import type { XliffEc } from "./XliffEc.js";
import type { XliffEm } from "./XliffEm.js";
import type { XliffPc } from "./XliffPc.js";
import type { XliffPh } from "./XliffPh.js";
import type { XliffSc } from "./XliffSc.js";
import type { XliffSm } from "./XliffSm.js";

export class XliffMrk implements XliffElement {

    readonly elementName: string = "mrk";
    id: string;
    translate?: XliffYesNo;
    type?: XliffAnnotationType;
    ref?: string;
    value?: string;
    readonly content: Array<string | XliffCp | XliffPh | XliffPc | XliffSc | XliffEc | XliffMrk | XliffSm | XliffEm> = [];
    readonly otherAttributes: Array<XMLAttribute> = [];

    constructor(id: string) {
        this.id = id;
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getTranslate(): XliffYesNo | undefined {
        return this.translate;
    }

    setTranslate(translate: XliffYesNo | undefined): void {
        this.translate = translate;
    }

    getType(): XliffAnnotationType | undefined {
        return this.type;
    }

    setType(type: XliffAnnotationType | undefined): void {
        this.type = type;
    }

    getRef(): string | undefined {
        return this.ref;
    }

    setRef(ref: string | undefined): void {
        this.ref = ref;
    }

    getValue(): string | undefined {
        return this.value;
    }

    setValue(value: string | undefined): void {
        this.value = value;
    }

    getContent(): Array<string | XliffCp | XliffPh | XliffPc | XliffSc | XliffEc | XliffMrk | XliffSm | XliffEm> {
        return this.content;
    }

    setContent(content: Array<string | XliffCp | XliffPh | XliffPc | XliffSc | XliffEc | XliffMrk | XliffSm | XliffEm>): void {
        this.content.length = 0;
        this.content.push(...content);
    }

    getOtherAttributes(): Array<XMLAttribute> {
        return this.otherAttributes;
    }

    setOtherAttributes(otherAttributes: Array<XMLAttribute>): void {
        this.otherAttributes.length = 0;
        this.otherAttributes.push(...otherAttributes);
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

    setOtherAttribute(name: string, value: string): void {
        const attribute: XMLAttribute | undefined = this.otherAttributes.find((item) => item.getName() === name);
        if (attribute) {
            attribute.setValue(value);
            return;
        }
        this.otherAttributes.push(new XMLAttribute(name, value));
    }

    isValid(): boolean {
        if (!XMLUtils.isValidNMTOKEN(this.id)) {
            return false;
        }
        if (this.translate !== undefined && this.translate !== 'yes' && this.translate !== 'no') {
            return false;
        }
        if (this.type !== undefined && this.type !== 'generic' && this.type !== 'comment' && this.type !== 'term') {
            if (!this.type.includes(':') || this.type.startsWith(':') || this.type.endsWith(':')) {
                return false;
            }
        }
        if (this.type === 'comment' && this.value === undefined && this.ref === undefined) {
            return false;
        }
        if (this.ref !== undefined && !isValidFragmentIdentifier(this.ref)) {
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        const attributes: Array<[string, string | undefined]> = [
            ['id', this.id],
            ['translate', this.translate],
            ['type', this.type],
            ['ref', this.ref],
            ['value', this.value]
        ];
        for (const [name, value] of attributes) {
            if (value !== undefined) {
                element.setAttribute(new XMLAttribute(name, value));
            }
        }
        for (const otherAttribute of this.otherAttributes) {
            element.setAttribute(otherAttribute);
        }
        for (const item of this.content) {
            if (typeof item === 'string') {
                element.addString(item);
            } else {
                element.addElement(item.toElement());
            }
        }
        return element;
    }
}
