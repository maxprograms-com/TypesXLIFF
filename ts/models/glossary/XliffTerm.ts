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
import { XliffElement } from "../XliffElement.js";
import { ModuleElement } from "../moduleElement.js";

export class XliffTerm implements XliffElement, ModuleElement {

    readonly elementName: string = "term";
    text: string = '';
    source?: string;
    prefix?: string;
    readonly otherAttributes: Array<XMLAttribute> = [];

    constructor(text?: string) {
        if (text !== undefined) {
            this.text = text;
        }
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

    getSource(): string | undefined {
        return this.source;
    }

    setSource(source: string | undefined): void {
        this.source = source;
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
        if (this.text.length === 0) {
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.prefix ? this.prefix + ':' + this.elementName : this.elementName);
        if (this.source !== undefined) {
            element.setAttribute(new XMLAttribute('source', this.source));
        }
        for (const otherAttribute of this.otherAttributes) {
            element.setAttribute(otherAttribute);
        }
        element.addString(this.text);
        return element;
    }

    setNamespacePrefix(prefix: string): void {
        this.prefix = prefix;
    }

    getNamespacePrefix(): string | undefined {
        return this.prefix;
    }
}
