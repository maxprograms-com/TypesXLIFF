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

import { LanguageUtils } from "typesbcp47";
import { Indenter, TextNode, XMLAttribute, XMLDeclaration, XMLDocument, XMLElement, XMLUtils, XMLWriter } from "typesxml";
import type { XliffMetadata } from "../metadata/XliffMetadata.js";
import { NamespaceUtils } from "../namespaceUtils.js";
import { XliffElement } from "../XliffElement.js";
import type { XliffVersion, XliffXmlSpace } from "../XliffTypes.js";
import type { XliffFile } from "./XliffFile.js";
import type { XliffGroup } from "./XliffGroup.js";
import type { XliffNote } from "./XliffNote.js";
import { XliffNotes } from "./XliffNotes.js";
import type { XliffUnit } from "./XliffUnit.js";

export class XliffDocument implements XliffElement {

    readonly elementName: string = "xliff";
    version: XliffVersion;
    srcLang: string;
    trgLang?: string;
    xmlSpace?: XliffXmlSpace;
    notes?: XliffNotes;
    metadata?: XliffMetadata;
    errorReason: string = '';
    readonly files: Array<XliffFile> = [];
    readonly otherAttributes: Array<XMLAttribute> = [];

    constructor(version: XliffVersion, srcLang: string, trgLang?: string) {
        this.version = version;
        this.srcLang = srcLang;
        this.trgLang = trgLang;
    }

    getVersion(): XliffVersion {
        return this.version;
    }

    setVersion(version: XliffVersion): void {
        this.version = version;
    }

    getSrcLang(): string {
        return this.srcLang;
    }

    setSrcLang(srcLang: string): void {
        this.srcLang = srcLang;
    }

    getTrgLang(): string | undefined {
        return this.trgLang;
    }

    setTrgLang(trgLang: string | undefined): void {
        this.trgLang = trgLang;
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

    getFiles(): Array<XliffFile> {
        return this.files;
    }

    setFiles(files: Array<XliffFile>): void {
        this.files.length = 0;
        this.files.push(...files);
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

    addFile(file: XliffFile): void {
        this.files.push(file);
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
        if (['1.0', '1.1', '1.2'].includes(this.version)) {
            this.errorReason = 'XLIFF ' + this.version + ' is not supported';
            return false;
        }
        if (!(this.version === "2.0" || this.version === "2.1" || this.version === "2.2")) {
            this.errorReason = 'The @version attribute value "' + this.version + '" is not valid';
            return false;
        }
        if ((this.notes !== undefined || this.metadata !== undefined) && this.version !== "2.2") {
            this.errorReason = 'The <notes> and <metadata> elements are only allowed in XLIFF 2.2 documents';
            return false;
        }
        if (this.notes !== undefined && !this.notes.isValid()) {
            this.errorReason = 'The <notes> element is not valid: ' + this.notes.getValidationError();
            return false;
        }
        if (this.metadata !== undefined && !this.metadata.isValid()) {
            this.errorReason = 'The <metadata> element is not valid: ' + this.metadata.getValidationError();
            return false;
        }
        if (this.xmlSpace !== undefined && !(this.xmlSpace === 'preserve' || this.xmlSpace === 'default')) {
            this.errorReason = 'The @xml:space attribute value "' + this.xmlSpace + '" is not valid';
            return false;
        }
        for (const otherAttribute of this.otherAttributes) {
            if ('xml:space' === otherAttribute.getName()) {
                continue;
            }
            if ('xmlns' === otherAttribute.getName()) {
                if (!new NamespaceUtils().isXliffNamespace(otherAttribute.getValue())) {
                    this.errorReason = 'The @xmlns attribute value "' + otherAttribute.getValue() + '" is not a valid XLIFF namespace';
                    return false;
                }
                continue;
            }
            if (otherAttribute.getName().startsWith('xmlns:')) {
                if (!new NamespaceUtils().isValidNamespace(otherAttribute.getValue())) {
                    this.errorReason = 'The @' + otherAttribute.getName() + ' attribute value "' + otherAttribute.getValue() + '" is not valid';
                    return false;
                }
                continue;
            }
            const parts: Array<string> = otherAttribute.getName().split(':');
            if (parts.length !== 2 || !XMLUtils.isValidNMTOKEN(parts[0]) || !XMLUtils.isValidNMTOKEN(parts[1])) {
                this.errorReason = 'The @' + otherAttribute.getName() + ' attribute value "' + otherAttribute.getValue() + '" is not valid';
                return false;
            }
        }
        if (this.files.length === 0) {
            this.errorReason = 'The <file> element is required';
            return false;
        }
        const ids: Set<string> = new Set<string>();
        for (const file of this.files) {
            if (ids.has(file.id)) {
                this.errorReason = 'The @id attribute value "' + file.id + '" is not unique';
                return false;
            }
            ids.add(file.id);
        }
        if (!LanguageUtils.isValidLanguageTag(this.srcLang)) {
            this.errorReason = 'The @srcLang attribute value "' + this.srcLang + '" is not valid';
            return false;
        }
        if (this.trgLang !== undefined && !LanguageUtils.isValidLanguageTag(this.trgLang)) {
            this.errorReason = 'The @trgLang attribute value "' + this.trgLang + '" is not valid';
            return false;
        }
        let hasTarget: boolean = false;
        for (const file of this.files) {
            const pending: Array<XliffUnit | XliffGroup> = [...file.entries];
            while (pending.length > 0) {
                const entry: XliffUnit | XliffGroup | undefined = pending.pop();
                if (!entry) {
                    continue;
                }
                if ('entries' in entry) {
                    pending.push(...entry.entries);
                    continue;
                }
                for (const item of entry.items) {
                    const sourceXmlLang: string | undefined = item.source?.xmlLang;
                    if (sourceXmlLang !== undefined && sourceXmlLang !== this.srcLang) {
                        this.errorReason = 'The @xml:lang attribute value "' + sourceXmlLang + '" in <source> element does not match the @srcLang attribute value "' + this.srcLang + '" in the <xliff> element';
                        return false;
                    }
                    const targetXmlLang: string | undefined = item.target?.xmlLang;
                    if (item.target !== undefined) {
                        hasTarget = true;
                        if (targetXmlLang !== undefined && targetXmlLang !== this.trgLang) {
                            this.errorReason = 'The @xml:lang attribute value "' + targetXmlLang + '" in <target> element does not match the @trgLang attribute value "' + this.trgLang + '" in the <xliff> element';
                            return false;
                        }
                    }
                }
            }
        }
        if (hasTarget && this.trgLang === undefined) {
            this.errorReason = 'The @trgLang attribute is required when there are <target> elements';
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        element.setAttribute(new XMLAttribute('version', this.version));
        element.setAttribute(new XMLAttribute('srcLang', this.srcLang));
        if (this.trgLang !== undefined) {
            element.setAttribute(new XMLAttribute('trgLang', this.trgLang));
        }
        if (this.xmlSpace !== undefined) {
            element.setAttribute(new XMLAttribute('xml:space', this.xmlSpace));
        }
        for (const otherAttribute of this.otherAttributes) {
            element.setAttribute(otherAttribute);
        }
        if (this.notes) {
            element.addElement(this.notes.toElement());
        }
        if (this.metadata) {
            element.addElement(this.metadata.toElement());
        }
        for (const file of this.files) {
            element.addElement(file.toElement());
        }
        return element;
    }

    toXMLDocument(): XMLDocument {
        const document: XMLDocument = new XMLDocument();
        const declaration: XMLDeclaration = new XMLDeclaration('1.0', 'UTF-8');
        const root: XMLElement = this.toElement();
        document.addTextNode(new TextNode('\n'));

        const nsVersion: string = this.version === '2.2' ? '2.2' : '2.0';
        root.setAttribute(new XMLAttribute('xmlns', 'urn:oasis:names:tc:xliff:document:' + nsVersion));

        document.setXmlDeclaration(declaration);
        document.setRoot(root);
        return document;
    }

    writeDocument(filePath: string, indent?: boolean): void {
        const document: XMLDocument = this.toXMLDocument();
        if (indent) {
            const indenter: Indenter = new Indenter(2, 0);
            indenter.indent(document.getRoot() as XMLElement);
        }
        XMLWriter.writeDocument(document, filePath);
    }

    getValidationError(): string {
        return this.errorReason;
    }
}
