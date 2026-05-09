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

export class XliffSm implements XliffElement {

    readonly elementName: string = "sm";
    id: string;
    translate?: XliffYesNo;
    type?: XliffAnnotationType;
    ref?: string;
    value?: string;
    errorReason: string = '';
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

    getOtherAttributes(): Array<XMLAttribute> {
        return this.otherAttributes;
    }

    setOtherAttributes(otherAttributes: Array<XMLAttribute>): void {
        this.otherAttributes.length = 0;
        this.otherAttributes.push(...otherAttributes);
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
            this.errorReason = 'The @id attribute value "' + this.id + '" is not valid';
            return false;
        }
        if (this.translate !== undefined && this.translate !== "yes" && this.translate !== "no") {
            this.errorReason = 'The @translate attribute value "' + this.translate + '" is not valid';
            return false;
        }
        if (this.type !== undefined && this.type !== "generic" && this.type !== "comment" && this.type !== "term") {
            if (!this.type.includes(':') || this.type.startsWith(':') || this.type.endsWith(':')) {
                this.errorReason = 'The @type attribute value "' + this.type + '" is not valid';
                return false;
            }
        }
        if (this.type === "comment" && this.value === undefined && this.ref === undefined) {
            this.errorReason = 'The @type attribute value is "comment" but @value and @ref are not set';
            return false;
        }
        if (this.ref !== undefined && !isValidFragmentIdentifier(this.ref)) {
            this.errorReason = 'The @ref attribute value "' + this.ref + '" is not a valid fragment identifier';
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        const attributes: Array<[string, string | undefined]> = [
            ["id", this.id],
            ["translate", this.translate],
            ["type", this.type],
            ["ref", this.ref],
            ["value", this.value]
        ];
        for (const [name, value] of attributes) {
            if (value !== undefined) {
                element.setAttribute(new XMLAttribute(name, value));
            }
        }
        for (const otherAttribute of this.otherAttributes) {
            element.setAttribute(otherAttribute);
        }
        return element;
    }

    getValidationError(): string {
        return this.errorReason;
    }
}
