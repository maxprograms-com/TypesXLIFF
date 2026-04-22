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

export class XliffCp implements XliffElement {

    readonly elementName: string = "cp";
    hex: string;

    constructor(hex: string) {
        this.hex = hex;
    }

    getHex(): string {
        return this.hex;
    }

    setHex(hex: string): void {
        this.hex = hex;
    }

    isValid(): boolean {
        if (!/^[0-9A-Fa-f]{4,6}$/.test(this.hex) || this.hex.length % 2 !== 0) {
            return false;
        }
        const value: number = Number.parseInt(this.hex, 16);
        if (!Number.isInteger(value) || value < 0 || value > 0x10FFFF) {
            return false;
        }
        const isValidXmlCharacter: boolean = value === 0x9
            || value === 0xA
            || value === 0xD
            || (value >= 0x20 && value <= 0xD7FF)
            || (value >= 0xE000 && value <= 0xFFFD)
            || (value >= 0x10000 && value <= 0x10FFFF);
        return !isValidXmlCharacter;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        element.setAttribute(new XMLAttribute('hex', this.hex));
        return element;
    }
}
