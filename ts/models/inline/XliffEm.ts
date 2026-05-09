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

export class XliffEm implements XliffElement {

    readonly elementName: string = "em";
    startRef: string;
    errorReason: string = '';

    constructor(startRef: string) {
        this.startRef = startRef;
    }

    getStartRef(): string {
        return this.startRef;
    }

    setStartRef(startRef: string): void {
        this.startRef = startRef;
    }

    isValid(): boolean {
        if (!XMLUtils.isValidNMTOKEN(this.startRef)) {
            this.errorReason = 'The @startRef attribute value "' + this.startRef + '" is not a valid NMTOKEN';
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        element.setAttribute(new XMLAttribute('startRef', this.startRef));
        return element;
    }

    getValidationError(): string {
        return this.errorReason;
    }
}
