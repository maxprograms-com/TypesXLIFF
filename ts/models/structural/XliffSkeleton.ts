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

export class XliffSkeleton implements XliffElement {

    readonly elementName: string = "skeleton";
    href?: string;
    readonly content: Array<string | XMLElement> = [];
    errorReason: string = '';

    constructor(href?: string) {
        this.href = href;
    }

    getHref(): string | undefined {
        return this.href;
    }

    setHref(href: string | undefined): void {
        this.href = href;
    }

    getContent(): Array<string | XMLElement> {
        return this.content;
    }

    setContent(content: Array<string | XMLElement>): void {
        this.content.length = 0;
        this.content.push(...content);
    }

    addText(text: string): void {
        this.content.push(text);
    }

    addOtherElement(element: XMLElement): void {
        this.content.push(element);
    }

    isValid(): boolean {
        const hasContent: boolean = this.content.some((item) => typeof item === "string" ? item.length > 0 : true);
        if (hasContent && this.href !== undefined) {
            this.errorReason = 'The <skeleton> element cannot contain content when the @href attribute is defined';
            return false;
        }
        if (!hasContent && this.href === undefined) {
            this.errorReason = 'The <skeleton> element must contain content or have the @href attribute defined';
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        if (this.href !== undefined) {
            element.setAttribute(new XMLAttribute('href', this.href));
        }
        for (const item of this.content) {
            if (typeof item === "string") {
                element.addString(item);
            } else {
                element.addElement(item);
            }
        }
        return element;
    }

    getValidationError(): string {
        return this.errorReason;
    }
}
