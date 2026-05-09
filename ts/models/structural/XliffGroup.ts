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
import type { XliffMetadata } from "../metadata/XliffMetadata.js";
import { XliffElement } from "../XliffElement.js";
import type { XliffDirection, XliffXmlSpace, XliffYesNo } from "../XliffTypes.js";
import type { XliffNote } from "./XliffNote.js";
import { XliffNotes } from "./XliffNotes.js";
import type { XliffUnit } from "./XliffUnit.js";

export class XliffGroup implements XliffElement {

    readonly elementName: string = "group";
    id: string;
    name?: string;
    canResegment?: XliffYesNo;
    translate?: XliffYesNo;
    srcDir?: XliffDirection;
    trgDir?: XliffDirection;
    type?: string;
    xmlSpace?: XliffXmlSpace;
    notes?: XliffNotes;
    metadata?: XliffMetadata;
    errorReason: string = '';
    readonly entries: Array<XliffUnit | XliffGroup> = [];
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

    getType(): string | undefined {
        return this.type;
    }

    setType(type: string | undefined): void {
        this.type = type;
    }

    getXmlSpace(): XliffXmlSpace | undefined {
        return this.xmlSpace;
    }

    setXmlSpace(xmlSpace: XliffXmlSpace | undefined): void {
        this.xmlSpace = xmlSpace;
    }

    getNotes(): XliffNotes | undefined {
        return this.notes;
    }

    setNotes(notes: XliffNotes | undefined): void {
        this.notes = notes;
    }

    getMetadata(): XliffMetadata | undefined {
        return this.metadata;
    }

    setMetadata(metadata: XliffMetadata | undefined): void {
        this.metadata = metadata;
    }

    getEntries(): Array<XliffUnit | XliffGroup> {
        return this.entries;
    }

    setEntries(entries: Array<XliffUnit | XliffGroup>): void {
        this.entries.length = 0;
        this.entries.push(...entries);
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

    addUnit(unit: XliffUnit): void {
        this.entries.push(unit);
    }

    addGroup(group: XliffGroup): void {
        this.entries.push(group);
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
            this.errorReason = 'Invalid @id attribute value';
            return false;
        }
        if (this.canResegment !== undefined && !(this.canResegment === "yes" || this.canResegment === "no")) {
            this.errorReason = 'The @canResegment attribute value "' + this.canResegment + '" is not valid';
            return false;
        }
        if (this.translate !== undefined && !(this.translate === "yes" || this.translate === "no")) {
            this.errorReason = 'The @translate attribute value "' + this.translate + '" is not valid';
            return false;
        }
        if (this.srcDir !== undefined && !(this.srcDir === "ltr" || this.srcDir === "rtl" || this.srcDir === "auto")) {
            this.errorReason = 'The @srcDir attribute value "' + this.srcDir + '" is not valid';
            return false;
        }
        if (this.trgDir !== undefined && !(this.trgDir === "ltr" || this.trgDir === "rtl" || this.trgDir === "auto")) {
            this.errorReason = 'The @trgDir attribute value "' + this.trgDir + '" is not valid';
            return false;
        }
        if (this.type !== undefined) {
            const parts: Array<string> = this.type.split(':');
            if (parts.length !== 2 || !XMLUtils.isValidNMTOKEN(parts[0]) || !XMLUtils.isValidNMTOKEN(parts[1])) {
                this.errorReason = 'The @type attribute value "' + this.type + '" is not valid';
                return false;
            }
        }
        if (this.xmlSpace !== undefined && !(this.xmlSpace === "preserve" || this.xmlSpace === "default")) {
            this.errorReason = 'The @xml:space attribute value "' + this.xmlSpace + '" is not valid';
            return false;
        }
        for (const otherAttribute of this.otherAttributes) {
            const parts: Array<string> = otherAttribute.getName().split(':');
            if (parts.length !== 2 || !XMLUtils.isValidNMTOKEN(parts[0]) || !XMLUtils.isValidNMTOKEN(parts[1])) {
                this.errorReason = 'Invalid @' + otherAttribute.getName() + ' attribute value';
                return false;
            }
        }
        const noteIds: Set<string> = new Set<string>();
        if (this.notes !== undefined) {
            for (const note of this.notes.notes) {
                if (note.id === undefined) {
                    continue;
                }
                if (noteIds.has(note.id)) {
                    this.errorReason = 'Duplicate @id attribute value "' + note.id + '" found';
                    return false;
                }
                noteIds.add(note.id);
            }
        }
        const notePending: Array<XliffUnit | XliffGroup> = [...this.entries];
        while (notePending.length > 0) {
            const entry: XliffUnit | XliffGroup | undefined = notePending.pop();
            if (entry === undefined) {
                continue;
            }
            if (entry.notes !== undefined) {
                for (const note of entry.notes.notes) {
                    if (note.id === undefined) {
                        continue;
                    }
                    if (noteIds.has(note.id)) {
                        this.errorReason = 'Duplicate @id attribute value "' + note.id + '" found';
                        return false;
                    }
                    noteIds.add(note.id);
                }
            }
            if ('entries' in entry) {
                notePending.push(...entry.entries);
            }
        }
        const ids: Set<string> = new Set<string>([this.id]);
        const pending: Array<XliffGroup> = this.entries.filter((entry): entry is XliffGroup => 'entries' in entry);
        while (pending.length > 0) {
            const group: XliffGroup | undefined = pending.pop();
            if (group === undefined) {
                continue;
            }
            if (ids.has(group.id)) {
                this.errorReason = 'Duplicate @id attribute value "' + group.id + '" found';
                return false;
            }
            ids.add(group.id);
            pending.push(...group.entries.filter((entry): entry is XliffGroup => 'entries' in entry));
        }
        if (this.entries.length === 0) {
            this.errorReason = 'The <group> element must contain at least one <unit> or <group> element';
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
        if (this.type !== undefined) {
            element.setAttribute(new XMLAttribute('type', this.type));
        }
        if (this.xmlSpace !== undefined) {
            element.setAttribute(new XMLAttribute('xml:space', this.xmlSpace));
        }
        for (const otherAttribute of this.otherAttributes) {
            element.setAttribute(otherAttribute);
        }
        for (const otherElement of this.otherElements) {
            element.addElement(otherElement);
        }
        if (this.metadata) {
            element.addElement(this.metadata.toElement());
        }
        if (this.notes) {
            element.addElement(this.notes.toElement());
        }
        for (const entry of this.entries) {
            element.addElement(entry.toElement());
        }
        return element;
    }

    getValidationError(): string {
        return this.errorReason;
    }
}
