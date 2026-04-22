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

import { XMLElement } from "typesxml";
import { XliffElement } from "../XliffElement.js";
import type { XliffData } from "./XliffData.js";

export class XliffOriginalData implements XliffElement {

    readonly elementName: string = "originalData";
    readonly dataItems: Array<XliffData> = [];

    getDataItems(): Array<XliffData> {
        return this.dataItems;
    }

    setDataItems(dataItems: Array<XliffData>): void {
        this.dataItems.length = 0;
        this.dataItems.push(...dataItems);
    }

    addData(data: XliffData): void {
        this.dataItems.push(data);
    }

    isValid(): boolean {
        if (this.dataItems.length === 0) {
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        for (const data of this.dataItems) {
            element.addElement(data.toElement());
        }
        return element;
    }
}
