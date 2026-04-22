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
import type { XliffMetadata } from "../metadata/XliffMetadata.js";
import { ModuleElement } from "../moduleElement.js";
import type { XliffOriginalData } from "../structural/XliffOriginalData.js";
import type { XliffSource } from "../structural/XliffSource.js";
import type { XliffTarget } from "../structural/XliffTarget.js";
import { XliffElement } from "../XliffElement.js";
import { isValidFragmentIdentifier } from "../XliffFragment.js";
import type { XliffMatchType, XliffYesNo } from "../XliffTypes.js";

const MATCH_TYPES: Set<string> = new Set(["am", "mt", "icm", "idm", "tb", "tm", "other"]);

export class XliffMatch implements XliffElement, ModuleElement {

    readonly elementName: string = "match";
    ref: string;
    source?: XliffSource;
    target?: XliffTarget;
    id?: string;
    matchQuality?: string;
    matchSuitability?: string;
    origin?: string;
    reference?: XliffYesNo;
    similarity?: string;
    subType?: string;
    type?: XliffMatchType;
    metadata?: XliffMetadata;
    originalData?: XliffOriginalData;
    readonly otherElements: Array<XMLElement> = [];
    readonly otherAttributes: Array<XMLAttribute> = [];
    prefix?: string;

    constructor(ref: string) {
        this.ref = ref;
    }

    getRef(): string {
        return this.ref;
    }

    setRef(ref: string): void {
        this.ref = ref;
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

    getId(): string | undefined {
        return this.id;
    }

    setId(id: string | undefined): void {
        this.id = id;
    }

    getMatchQuality(): string | undefined {
        return this.matchQuality;
    }

    setMatchQuality(matchQuality: string | undefined): void {
        this.matchQuality = matchQuality;
    }

    getMatchSuitability(): string | undefined {
        return this.matchSuitability;
    }

    setMatchSuitability(matchSuitability: string | undefined): void {
        this.matchSuitability = matchSuitability;
    }

    getOrigin(): string | undefined {
        return this.origin;
    }

    setOrigin(origin: string | undefined): void {
        this.origin = origin;
    }

    getReference(): XliffYesNo | undefined {
        return this.reference;
    }

    setReference(reference: XliffYesNo | undefined): void {
        this.reference = reference;
    }

    getSimilarity(): string | undefined {
        return this.similarity;
    }

    setSimilarity(similarity: string | undefined): void {
        this.similarity = similarity;
    }

    getSubType(): string | undefined {
        return this.subType;
    }

    setSubType(subType: string | undefined): void {
        this.subType = subType;
    }

    getType(): XliffMatchType | undefined {
        return this.type;
    }

    setType(type: XliffMatchType | undefined): void {
        this.type = type;
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

    private isValidPercentage(value: string): boolean {
        const parsed: number = Number(value);
        return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100;
    }

    isValid(): boolean {
        if (this.id !== undefined && (this.id.trim().length === 0 || /\s/.test(this.id))) {
            return false;
        }
        if (!isValidFragmentIdentifier(this.ref)) {
            return false;
        }
        if (this.matchQuality !== undefined && !this.isValidPercentage(this.matchQuality)) {
            return false;
        }
        if (this.matchSuitability !== undefined && !this.isValidPercentage(this.matchSuitability)) {
            return false;
        }
        if (this.similarity !== undefined && !this.isValidPercentage(this.similarity)) {
            return false;
        }
        if (this.subType !== undefined) {
            if (this.type === undefined) {
                return false;
            }
            if (!this.subType.includes(':') || this.subType.startsWith(':') || this.subType.endsWith(':')) {
                return false;
            }
        }
        if (this.type !== undefined && !MATCH_TYPES.has(this.type)) {
            return false;
        }
        if (this.metadata !== undefined && !this.metadata.isValid()) {
            return false;
        }
        if (this.originalData !== undefined && !this.originalData.isValid()) {
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.prefix ? this.prefix + ':' + this.elementName : this.elementName);
        if (this.id !== undefined) {
            element.setAttribute(new XMLAttribute('id', this.id));
        }
        if (this.matchQuality !== undefined) {
            element.setAttribute(new XMLAttribute('matchQuality', this.matchQuality));
        }
        if (this.matchSuitability !== undefined) {
            element.setAttribute(new XMLAttribute('matchSuitability', this.matchSuitability));
        }
        if (this.origin !== undefined) {
            element.setAttribute(new XMLAttribute('origin', this.origin));
        }
        element.setAttribute(new XMLAttribute('ref', this.ref));
        if (this.reference !== undefined) {
            element.setAttribute(new XMLAttribute('reference', this.reference));
        }
        if (this.similarity !== undefined) {
            element.setAttribute(new XMLAttribute('similarity', this.similarity));
        }
        if (this.subType !== undefined) {
            element.setAttribute(new XMLAttribute('subType', this.subType));
        }
        if (this.type !== undefined) {
            element.setAttribute(new XMLAttribute('type', this.type));
        }
        for (const otherAttribute of this.otherAttributes) {
            element.setAttribute(otherAttribute);
        }
        if (this.metadata) {
            element.addElement(this.metadata.toElement());
        }
        if (this.originalData) {
            element.addElement(this.originalData.toElement());
        }
        if (this.source) {
            element.addElement(this.source.toElement());
        }
        if (this.target) {
            element.addElement(this.target.toElement());
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
}