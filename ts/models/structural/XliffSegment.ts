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
import type { XliffSegmentState, XliffYesNo } from "../XliffTypes.js";
import type { XliffSource } from "./XliffSource.js";
import type { XliffTarget } from "./XliffTarget.js";

export class XliffSegment implements XliffElement {

    readonly elementName: string = "segment";
    id?: string;
    canResegment?: XliffYesNo;
    state?: XliffSegmentState;
    subState?: string;
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

    getCanResegment(): XliffYesNo | undefined {
        return this.canResegment;
    }

    setCanResegment(canResegment: XliffYesNo | undefined): void {
        this.canResegment = canResegment;
    }

    getState(): XliffSegmentState | undefined {
        return this.state;
    }

    setState(state: XliffSegmentState | undefined): void {
        this.state = state;
    }

    getSubState(): string | undefined {
        return this.subState;
    }

    setSubState(subState: string | undefined): void {
        this.subState = subState;
    }

    getSource(): XliffSource | undefined {
        return this.source;
    }

    setSource(source: XliffSource): void {
        this.source = source;
    }

    getTarget(): XliffTarget | undefined {
        return this.target;
    }

    setTarget(target: XliffTarget): void {
        this.target = target;
    }

    isValid(): boolean {
        if (this.id !== undefined && !XMLUtils.isValidNMTOKEN(this.id)) {
            return false;
        }
        if (this.canResegment !== undefined && !(this.canResegment === "yes" || this.canResegment === "no")) {
            return false;
        }
        if (this.state !== undefined && !(this.state === "initial" || this.state === "translated" || this.state === "reviewed" || this.state === "final")) {
            return false;
        }
        if (this.subState !== undefined) {
            if (this.state === undefined) {
                return false;
            }
            const parts: Array<string> = this.subState.split(':');
            if (parts.length !== 2 || !XMLUtils.isValidNMTOKEN(parts[0]) || !XMLUtils.isValidNMTOKEN(parts[1])) {
                return false;
            }
        }
        if (this.state !== undefined && this.state !== 'initial' && this.target === undefined) {
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        if (this.id !== undefined) {
            element.setAttribute(new XMLAttribute('id', this.id));
        }
        if (this.canResegment !== undefined) {
            element.setAttribute(new XMLAttribute('canResegment', this.canResegment));
        }
        if (this.state !== undefined) {
            element.setAttribute(new XMLAttribute('state', this.state));
        }
        if (this.subState !== undefined) {
            element.setAttribute(new XMLAttribute('subState', this.subState));
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
