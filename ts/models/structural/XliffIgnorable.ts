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
import type { XliffSource } from "./XliffSource.js";
import type { XliffTarget } from "./XliffTarget.js";

export class XliffIgnorable implements XliffElement {

    readonly elementName: string = "ignorable";
    id?: string;
    source?: XliffSource;
    target?: XliffTarget;

    constructor(id?: string) {
        this.id = id;
    }

    getId(): string | undefined {
        return this.id;
    }

    setId(id: string | undefined): void {
        this.id = id;
    }

    getSource(): XliffSource | undefined {
        return this.source;
    }

    setSource(source: XliffSource | undefined): void {
        this.source = source;
    }

    getTarget(): XliffTarget | undefined {
        return this.target;
    }

    setTarget(target: XliffTarget | undefined): void {
        this.target = target;
    }

    isValid(): boolean {
        if (this.id !== undefined && !XMLUtils.isValidNMTOKEN(this.id)) {
            return false;
        }
        if (this.source === undefined) {
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        if (this.id !== undefined) {
            element.setAttribute(new XMLAttribute('id', this.id));
        }
        if (this.source) {
            element.addElement(this.source.toElement());
        }
        if (this.target) {
            element.addElement(this.target.toElement());
        }
        return element;
    }
}
