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
import type { XliffMetaGroupAppliesTo } from "../XliffTypes.js";
import type { XliffMeta } from "./XliffMeta.js";

export class XliffMetaGroup implements XliffElement, ModuleElement {

    readonly elementName: string = "metaGroup";
    id?: string;
    category?: string;
    appliesTo?: XliffMetaGroupAppliesTo;
    readonly items: Array<XliffMetaGroup | XliffMeta> = [];
    prefix?: string;

    constructor(id?: string, category?: string) {
        this.id = id;
        this.category = category;
    }

    getId(): string | undefined {
        return this.id;
    }

    setId(id: string | undefined): void {
        this.id = id;
    }

    getCategory(): string | undefined {
        return this.category;
    }

    setCategory(category: string | undefined): void {
        this.category = category;
    }

    getAppliesTo(): XliffMetaGroupAppliesTo | undefined {
        return this.appliesTo;
    }

    setAppliesTo(appliesTo: XliffMetaGroupAppliesTo | undefined): void {
        this.appliesTo = appliesTo;
    }

    getItems(): Array<XliffMetaGroup | XliffMeta> {
        return this.items;
    }

    setItems(items: Array<XliffMetaGroup | XliffMeta>): void {
        this.items.length = 0;
        this.items.push(...items);
    }

    addMetaGroup(metaGroup: XliffMetaGroup): void {
        this.items.push(metaGroup);
    }

    addMeta(meta: XliffMeta): void {
        this.items.push(meta);
    }

    isValid(): boolean {
        if (this.id !== undefined && !XMLUtils.isValidNMTOKEN(this.id)) {
            return false;
        }
        if (this.appliesTo !== undefined
            && this.appliesTo !== "source"
            && this.appliesTo !== "target"
            && this.appliesTo !== "ignorable") {
            return false;
        }
        if (this.items.length === 0) {
            return false;
        }
        for (const item of this.items) {
            if (!item.isValid()) {
                return false;
            }
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.prefix ? this.prefix + ':' + this.elementName : this.elementName);
        if (this.id !== undefined) {
            element.setAttribute(new XMLAttribute('id', this.id));
        }
        if (this.category !== undefined) {
            element.setAttribute(new XMLAttribute('category', this.category));
        }
        if (this.appliesTo !== undefined) {
            element.setAttribute(new XMLAttribute('appliesTo', this.appliesTo));
        }
        for (const item of this.items) {
            element.addElement(item.toElement());
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