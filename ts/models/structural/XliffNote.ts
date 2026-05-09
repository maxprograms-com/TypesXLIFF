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
import type { XliffNoteAppliesTo, XliffNotePriority } from "../XliffTypes.js";

export class XliffNote implements XliffElement {

    readonly elementName: string = "note";
    text: string = '';
    id?: string;
    appliesTo?: XliffNoteAppliesTo;
    category?: string;
    priority?: XliffNotePriority;
    ref?: string;
    errorReason: string = '';
    readonly otherAttributes: Array<XMLAttribute> = [];

    constructor(id?: string) {
        this.id = id;
    }

    getText(): string {
        return this.text;
    }

    addText(text: string): void {
        this.text += text;
    }

    setText(text: string): void {
        this.text = text;
    }

    getId(): string | undefined {
        return this.id;
    }

    setId(id: string | undefined): void {
        this.id = id;
    }

    getAppliesTo(): XliffNoteAppliesTo | undefined {
        return this.appliesTo;
    }

    setAppliesTo(appliesTo: XliffNoteAppliesTo | undefined): void {
        this.appliesTo = appliesTo;
    }

    getCategory(): string | undefined {
        return this.category;
    }

    setCategory(category: string | undefined): void {
        this.category = category;
    }

    getPriority(): XliffNotePriority | undefined {
        return this.priority;
    }

    setPriority(priority: XliffNotePriority | undefined): void {
        this.priority = priority;
    }

    getRef(): string | undefined {
        return this.ref;
    }

    setRef(ref: string | undefined): void {
        this.ref = ref;
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
        if (this.id !== undefined && !XMLUtils.isValidNMTOKEN(this.id)) {
            this.errorReason = 'The @id attribute value "' + this.id + '" is not valid';
            return false;
        }
        if (this.appliesTo !== undefined && !(this.appliesTo === "source" || this.appliesTo === "target")) {
            this.errorReason = 'The @appliesTo attribute value "' + this.appliesTo + '" is not valid';
            return false;
        }
        if (this.priority !== undefined && !Number.isInteger(this.priority)) {
            this.errorReason = 'The @priority attribute value "' + this.priority + '" is not valid';
            return false;
        }
        if (this.priority !== undefined && (this.priority < 1 || this.priority > 10)) {
            this.errorReason = 'The @priority attribute value "' + this.priority + '" is out of range';
            return false;
        }
        if (this.ref !== undefined && !isValidFragmentIdentifier(this.ref)) {
            this.errorReason = 'The @ref attribute value "' + this.ref + '" is not valid';
            return false;
        }
        for (const otherAttribute of this.otherAttributes) {
            const parts: Array<string> = otherAttribute.getName().split(':');
            if (parts.length !== 2 || !XMLUtils.isValidNMTOKEN(parts[0]) || !XMLUtils.isValidNMTOKEN(parts[1])) {
                this.errorReason = 'The @' + otherAttribute.getName() + ' attribute value "' + otherAttribute.getValue() + '" is not valid';
                return false;
            }
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        if (this.id !== undefined) {
            element.setAttribute(new XMLAttribute('id', this.id));
        }
        if (this.appliesTo !== undefined) {
            element.setAttribute(new XMLAttribute('appliesTo', this.appliesTo));
        }
        if (this.category !== undefined) {
            element.setAttribute(new XMLAttribute('category', this.category));
        }
        if (this.priority !== undefined) {
            element.setAttribute(new XMLAttribute('priority', String(this.priority)));
        }
        if (this.ref !== undefined) {
            element.setAttribute(new XMLAttribute('ref', this.ref));
        }
        for (const otherAttribute of this.otherAttributes) {
            element.setAttribute(otherAttribute);
        }
        element.addString(this.text);
        return element;
    }

    getValidationError(): string {
        return this.errorReason;
    }
}
