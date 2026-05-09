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
import { ModuleElement } from "../moduleElement.js";
import { XliffElement } from "../XliffElement.js";
import type { XliffDefinition } from "./XliffDefinition.js";
import type { XliffTerm } from "./XliffTerm.js";
import type { XliffTranslation } from "./XliffTranslation.js";

export class XliffGlossEntry implements XliffElement, ModuleElement {

    readonly elementName: string = "glossEntry";
    term: XliffTerm;
    id?: string;
    ref?: string;
    definition?: XliffDefinition;
    metadata?: XliffMetadata;
    prefix?: string;
    errorReason: string = '';
    readonly translations: Array<XliffTranslation> = [];
    readonly otherElements: Array<XMLElement> = [];
    readonly otherAttributes: Array<XMLAttribute> = [];

    constructor(term: XliffTerm) {
        this.term = term;
    }

    getTerm(): XliffTerm {
        return this.term;
    }

    setTerm(term: XliffTerm): void {
        this.term = term;
    }

    getId(): string | undefined {
        return this.id;
    }

    setId(id: string | undefined): void {
        this.id = id;
    }

    getRef(): string | undefined {
        return this.ref;
    }

    setRef(ref: string | undefined): void {
        this.ref = ref;
    }

    getDefinition(): XliffDefinition | undefined {
        return this.definition;
    }

    setDefinition(definition: XliffDefinition | undefined): void {
        this.definition = definition;
    }

    getMetadata(): XliffMetadata | undefined {
        return this.metadata;
    }

    setMetadata(metadata: XliffMetadata | undefined): void {
        this.metadata = metadata;
    }

    getTranslations(): Array<XliffTranslation> {
        return this.translations;
    }

    setTranslations(translations: Array<XliffTranslation>): void {
        this.translations.length = 0;
        this.translations.push(...translations);
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

    addTranslation(translation: XliffTranslation): void {
        this.translations.push(translation);
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
        if (this.id !== undefined && !XMLUtils.isValidNMTOKEN(this.id)) {
            this.errorReason = 'The @id attribute value "' + this.id + '" is not a valid NMTOKEN';
            return false;
        }
        if (!this.term.isValid()) {
            this.errorReason = 'The <term> element is not valid';
            return false;
        }
        if (this.translations.length === 0 && this.definition === undefined) {
            this.errorReason = 'At least one <translation> element or a <definition> element is required';
            return false;
        }
        for (const translation of this.translations) {
            if (!translation.isValid()) {
                this.errorReason = 'The <translation> element is not valid';
                return false;
            }
        }
        if (this.definition !== undefined && !this.definition.isValid()) {
            this.errorReason = 'The <definition> element is not valid';
            return false;
        }
        if (this.metadata !== undefined && !this.metadata.isValid()) {
            this.errorReason = 'The <metadata> element is not valid';
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.prefix ? this.prefix + ':' + this.elementName : this.elementName);
        if (this.id !== undefined) {
            element.setAttribute(new XMLAttribute('id', this.id));
        }
        if (this.ref !== undefined) {
            element.setAttribute(new XMLAttribute('ref', this.ref));
        }
        for (const otherAttribute of this.otherAttributes) {
            element.setAttribute(otherAttribute);
        }
        element.addElement(this.term.toElement());
        for (const translation of this.translations) {
            element.addElement(translation.toElement());
        }
        if (this.definition) {
            element.addElement(this.definition.toElement());
        }
        if (this.metadata) {
            element.addElement(this.metadata.toElement());
        }
        for (const otherElement of this.otherElements) {
            element.addElement(otherElement);
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
