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
import { XliffGlossary } from "../glossary/XliffGlossary.js";
import type { XliffGlossEntry } from "../glossary/XliffGlossEntry.js";
import type { XliffMatch } from "../matches/XliffMatch.js";
import { XliffMatches } from "../matches/XliffMatches.js";
import type { XliffMetadata } from "../metadata/XliffMetadata.js";
import { XliffElement } from "../XliffElement.js";
import type { XliffDirection, XliffXmlSpace, XliffYesNo } from "../XliffTypes.js";
import type { XliffIgnorable } from "./XliffIgnorable.js";
import type { XliffNote } from "./XliffNote.js";
import { XliffNotes } from "./XliffNotes.js";
import type { XliffOriginalData } from "./XliffOriginalData.js";
import type { XliffSegment } from "./XliffSegment.js";

export class XliffUnit implements XliffElement {

    readonly elementName: string = "unit";
    id: string;
    name?: string;
    canResegment?: XliffYesNo;
    translate?: XliffYesNo;
    srcDir?: XliffDirection;
    trgDir?: XliffDirection;
    xmlSpace?: XliffXmlSpace;
    type?: string;
    notes?: XliffNotes;
    matches?: XliffMatches;
    glossary?: XliffGlossary;
    metadata?: XliffMetadata;
    originalData?: XliffOriginalData;
    readonly items: Array<XliffSegment | XliffIgnorable> = [];
    readonly otherElements: Array<XMLElement> = [];
    readonly otherAttributes: Array<XMLAttribute> = [];

    constructor(id: string, name?: string) {
        this.id = id;
        this.name = name;
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getName(): string | undefined {
        return this.name;
    }

    setName(name: string | undefined): void {
        this.name = name;
    }

    getCanResegment(): XliffYesNo | undefined {
        return this.canResegment;
    }

    setCanResegment(canResegment: XliffYesNo | undefined): void {
        this.canResegment = canResegment;
    }

    getTranslate(): XliffYesNo | undefined {
        return this.translate;
    }

    setTranslate(translate: XliffYesNo | undefined): void {
        this.translate = translate;
    }

    getSrcDir(): XliffDirection | undefined {
        return this.srcDir;
    }

    setSrcDir(srcDir: XliffDirection | undefined): void {
        this.srcDir = srcDir;
    }

    getTrgDir(): XliffDirection | undefined {
        return this.trgDir;
    }

    setTrgDir(trgDir: XliffDirection | undefined): void {
        this.trgDir = trgDir;
    }

    getXmlSpace(): XliffXmlSpace | undefined {
        return this.xmlSpace;
    }

    setXmlSpace(xmlSpace: XliffXmlSpace | undefined): void {
        this.xmlSpace = xmlSpace;
    }

    getType(): string | undefined {
        return this.type;
    }

    setType(type: string | undefined): void {
        this.type = type;
    }

    getNotes(): XliffNotes | undefined {
        return this.notes;
    }

    setNotes(notes: XliffNotes | undefined): void {
        this.notes = notes;
    }

    getMatches(): XliffMatches | undefined {
        return this.matches;
    }

    setMatches(matches: XliffMatches | undefined): void {
        this.matches = matches;
    }

    getGlossary(): XliffGlossary | undefined {
        return this.glossary;
    }

    setGlossary(glossary: XliffGlossary | undefined): void {
        this.glossary = glossary;
    }

    getMetadata(): XliffMetadata | undefined {
        return this.metadata;
    }

    setMetadata(metadata: XliffMetadata | undefined): void {
        this.metadata = metadata;
    }

    getOriginalData(): XliffOriginalData | undefined {
        return this.originalData;
    }

    setOriginalData(originalData: XliffOriginalData | undefined): void {
        this.originalData = originalData;
    }

    getItems(): Array<XliffSegment | XliffIgnorable> {
        return this.items;
    }

    setItems(items: Array<XliffSegment | XliffIgnorable>): void {
        this.items.length = 0;
        this.items.push(...items);
    }

    getOtherElements(): Array<XMLElement> {
        return this.otherElements;
    }

    setOtherElements(otherElements: Array<XMLElement>): void {
        this.otherElements.length = 0;
        this.otherElements.push(...otherElements);
    }

    getOtherAttributes(): Array<XMLAttribute> {
        return this.otherAttributes;
    }

    setOtherAttributes(otherAttributes: Array<XMLAttribute>): void {
        this.otherAttributes.length = 0;
        this.otherAttributes.push(...otherAttributes);
    }

    addNote(note: XliffNote): void {
        if (!this.notes) {
            this.notes = new XliffNotes();
        }
        this.notes.addNote(note);
    }

    addMatch(match: XliffMatch): void {
        if (!this.matches) {
            this.matches = new XliffMatches();
        }
        this.matches.addMatch(match);
    }

    addGlossEntry(glossEntry: XliffGlossEntry): void {
        if (!this.glossary) {
            this.glossary = new XliffGlossary();
        }
        this.glossary.addGlossEntry(glossEntry);
    }

    addSegment(segment: XliffSegment): void {
        this.items.push(segment);
    }

    addIgnorable(ignorable: XliffIgnorable): void {
        this.items.push(ignorable);
    }

    addOtherElement(element: XMLElement): void {
        this.otherElements.push(element);
    }

    setOtherAttribute(name: string, value: string): void {
        const attribute: XMLAttribute | undefined = this.otherAttributes.find((item) => item.getName() === name);
        if (attribute) {
            attribute.setValue(value);
            return;
        }
        this.otherAttributes.push(new XMLAttribute(name, value));
    }

    isValid(): boolean {
        if (!XMLUtils.isValidNMTOKEN(this.id)) {
            return false;
        }
        if (this.canResegment !== undefined && !(this.canResegment === 'yes' || this.canResegment === 'no')) {
            return false;
        }
        if (this.translate !== undefined && !(this.translate === 'yes' || this.translate === 'no')) {
            return false;
        }
        if (this.srcDir !== undefined && !(this.srcDir === 'ltr' || this.srcDir === 'rtl' || this.srcDir === 'auto')) {
            return false;
        }
        if (this.trgDir !== undefined && !(this.trgDir === 'ltr' || this.trgDir === 'rtl' || this.trgDir === 'auto')) {
            return false;
        }
        if (this.type !== undefined) {
            const parts: Array<string> = this.type.split(':');
            if (parts.length !== 2 || !XMLUtils.isValidNMTOKEN(parts[0]) || !XMLUtils.isValidNMTOKEN(parts[1])) {
                return false;
            }
        }
        for (const otherAttribute of this.otherAttributes) {
            const parts: Array<string> = otherAttribute.getName().split(':');
            if (parts.length !== 2 || !XMLUtils.isValidNMTOKEN(parts[0]) || !XMLUtils.isValidNMTOKEN(parts[1])) {
                return false;
            }
        }
        if (this.xmlSpace !== undefined && !(this.xmlSpace === 'preserve' || this.xmlSpace === 'default')) {
            return false;
        }
        if (this.matches !== undefined && !this.matches.isValid()) {
            return false;
        }
        if (this.glossary !== undefined && !this.glossary.isValid()) {
            return false;
        }
        if (this.metadata !== undefined && !this.metadata.isValid()) {
            return false;
        }
        if (this.originalData !== undefined) {
            const ids: Set<string> = new Set<string>();
            for (const data of this.originalData.dataItems) {
                if (ids.has(data.id)) {
                    return false;
                }
                ids.add(data.id);
            }
        }
        if (this.notes !== undefined) {
            const noteIds: Set<string> = new Set<string>();
            for (const note of this.notes.notes) {
                if (note.id === undefined) {
                    continue;
                }
                if (noteIds.has(note.id)) {
                    return false;
                }
                noteIds.add(note.id);
            }
        }
        const itemIds: Set<string> = new Set<string>();
        for (const item of this.items) {
            if (item.id === undefined) {
                continue;
            }
            if (itemIds.has(item.id)) {
                return false;
            }
            itemIds.add(item.id);
        }
        const orders: Set<number> = new Set<number>();
        const maxOrder: number = this.items.length;
        for (const item of this.items) {
            if (item.target === undefined || item.target.order === undefined) {
                continue;
            }
            const order: number = typeof item.target.order === "number" ? item.target.order : Number(item.target.order);
            if (orders.has(order) || order > maxOrder) {
                return false;
            }
            orders.add(order);
        }
        if (this.items.length === 0) {
            return false;
        }
        if (!this.items.some((item) => item.elementName === 'segment')) {
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        element.setAttribute(new XMLAttribute('id', this.id));
        if (this.name !== undefined) {
            element.setAttribute(new XMLAttribute('name', this.name));
        }
        if (this.canResegment !== undefined) {
            element.setAttribute(new XMLAttribute('canResegment', this.canResegment));
        }
        if (this.translate !== undefined) {
            element.setAttribute(new XMLAttribute('translate', this.translate));
        }
        if (this.srcDir !== undefined) {
            element.setAttribute(new XMLAttribute('srcDir', this.srcDir));
        }
        if (this.trgDir !== undefined) {
            element.setAttribute(new XMLAttribute('trgDir', this.trgDir));
        }
        if (this.xmlSpace !== undefined) {
            element.setAttribute(new XMLAttribute('xml:space', this.xmlSpace));
        }
        if (this.type !== undefined) {
            element.setAttribute(new XMLAttribute('type', this.type));
        }
        for (const otherAttribute of this.otherAttributes) {
            element.setAttribute(otherAttribute);
        }
        for (const otherElement of this.otherElements) {
            element.addElement(otherElement);
        }
        if (this.matches) {
            element.addElement(this.matches.toElement());
        }
        if (this.glossary) {
            element.addElement(this.glossary.toElement());
        }
        if (this.metadata) {
            element.addElement(this.metadata.toElement());
        }
        if (this.notes) {
            element.addElement(this.notes.toElement());
        }
        if (this.originalData) {
            element.addElement(this.originalData.toElement());
        }
        for (const item of this.items) {
            element.addElement(item.toElement());
        }
        return element;
    }
}
