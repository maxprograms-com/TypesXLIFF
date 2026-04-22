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

export class XliffMeta implements XliffElement, ModuleElement {

    readonly elementName: string = "meta";
    type: string;
    text: string = '';
    prefix?: string;

    constructor(type: string) {
        this.type = type;
    }

    getType(): string {
        return this.type;
    }

    setType(type: string): void {
        this.type = type;
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

    isValid(): boolean {
        if (this.type === undefined) {
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.prefix ? this.prefix + ':' + this.elementName : this.elementName);
        element.setAttribute(new XMLAttribute('type', this.type));
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