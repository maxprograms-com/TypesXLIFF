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
import { ModuleElement } from "../moduleElement.js";
import { XliffElement } from "../XliffElement.js";
import type { XliffMetaGroup } from "./XliffMetaGroup.js";

export class XliffMetadata implements XliffElement, ModuleElement {

    readonly elementName: string = "metadata";
    id?: string;
    readonly metaGroups: Array<XliffMetaGroup> = [];
    prefix?: string;

    constructor(id?: string) {
        this.id = id;
    }

    getId(): string | undefined {
        return this.id;
    }

    setId(id: string | undefined): void {
        this.id = id;
    }

    getMetaGroups(): Array<XliffMetaGroup> {
        return this.metaGroups;
    }

    setMetaGroups(metaGroups: Array<XliffMetaGroup>): void {
        this.metaGroups.length = 0;
        this.metaGroups.push(...metaGroups);
    }

    addMetaGroup(metaGroup: XliffMetaGroup): void {
        this.metaGroups.push(metaGroup);
    }

    isValid(): boolean {
        if (this.id !== undefined && !XMLUtils.isValidNMTOKEN(this.id)) {
            return false;
        }
        if (this.metaGroups.length === 0) {
            return false;
        }

        const ids: Set<string> = new Set<string>();
        if (this.id !== undefined) {
            ids.add(this.id);
        }

        const pending: Array<XliffMetaGroup> = [...this.metaGroups];
        while (pending.length > 0) {
            const metaGroup: XliffMetaGroup | undefined = pending.pop();
            if (!metaGroup) {
                continue;
            }
            if (!metaGroup.isValid()) {
                return false;
            }
            if (metaGroup.id !== undefined) {
                if (ids.has(metaGroup.id)) {
                    return false;
                }
                ids.add(metaGroup.id);
            }
            for (const item of metaGroup.items) {
                if ('items' in item) {
                    pending.push(item);
                }
            }
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.prefix ? this.prefix + ':' + this.elementName : this.elementName);
        if (this.id !== undefined) {
            element.setAttribute(new XMLAttribute('id', this.id));
        }
        for (const metaGroup of this.metaGroups) {
            element.addElement(metaGroup.toElement());
        }
        return element;
    }

    setNamespacePrefix(prefix: string): void {
        this.prefix = prefix;
    }

    getNamespacePrefix(): string | undefined {
        return this.prefix;
    }
}