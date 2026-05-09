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
import { ModuleElement } from "../moduleElement.js";
import { XliffElement } from "../XliffElement.js";
import type { XliffGlossEntry } from "./XliffGlossEntry.js";

export class XliffGlossary implements XliffElement, ModuleElement {

    readonly elementName: string = "glossary";
    readonly glossEntries: Array<XliffGlossEntry> = [];
    prefix?: string;
    errorReason: string = '';

    getGlossEntries(): Array<XliffGlossEntry> {
        return this.glossEntries;
    }

    setGlossEntries(glossEntries: Array<XliffGlossEntry>): void {
        this.glossEntries.length = 0;
        this.glossEntries.push(...glossEntries);
    }

    addGlossEntry(glossEntry: XliffGlossEntry): void {
        this.glossEntries.push(glossEntry);
    }

    isValid(): boolean {
        if (this.glossEntries.length === 0) {
            this.errorReason = 'At least one <glossEntry> is required in a <glossary> element';
            return false;
        }
        const ids: Set<string> = new Set<string>();
        for (const entry of this.glossEntries) {
            if (!entry.isValid()) {
                this.errorReason = 'Invalid <glossEntry> element: ' + entry.getValidationError();
                return false;
            }
            if (entry.id !== undefined) {
                if (ids.has(entry.id)) {
                    this.errorReason = 'Duplicate @id "' + entry.id + '" found in <glossEntry> elements';
                    return false;
                }
                ids.add(entry.id);
            }
            for (const translation of entry.translations) {
                if (translation.id !== undefined) {
                    if (ids.has(translation.id)) {
                        this.errorReason = 'Duplicate @id "' + translation.id + '" found in <translation> elements';
                        return false;
                    }
                    ids.add(translation.id);
                }
            }
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.prefix ? this.prefix + ':' + this.elementName : this.elementName);
        for (const entry of this.glossEntries) {
            element.addElement(entry.toElement());
        }
        return element;
    }

    setNamespacePrefix(prefix: string): void {
        this.prefix = prefix;
    }

    getNamespacePrefix(): string | undefined {
        return this.prefix;
    }

    getValidationError(): string {
        return this.errorReason;
    }
}
