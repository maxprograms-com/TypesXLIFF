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
import type { XliffCanReorder, XliffDirection, XliffInlineSubType, XliffInlineType, XliffYesNo } from "../XliffTypes.js";

export class XliffSc implements XliffElement {

    readonly elementName: string = "sc";
    id: string;
    canCopy?: XliffYesNo;
    canDelete?: XliffYesNo;
    canOverlap?: XliffYesNo;
    canReorder?: XliffCanReorder;
    copyOf?: string;
    dataRef?: string;
    dir?: XliffDirection;
    disp?: string;
    equiv?: string;
    isolated?: XliffYesNo;
    subFlows?: string;
    subType?: XliffInlineSubType;
    type?: XliffInlineType;
    errorReason: string = '';
    readonly otherAttributes: Array<XMLAttribute> = [];

    constructor(id: string) {
        this.id = id;
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getCanCopy(): XliffYesNo | undefined {
        return this.canCopy;
    }

    setCanCopy(canCopy: XliffYesNo | undefined): void {
        this.canCopy = canCopy;
    }

    getCanDelete(): XliffYesNo | undefined {
        return this.canDelete;
    }

    setCanDelete(canDelete: XliffYesNo | undefined): void {
        this.canDelete = canDelete;
    }

    getCanOverlap(): XliffYesNo | undefined {
        return this.canOverlap;
    }

    setCanOverlap(canOverlap: XliffYesNo | undefined): void {
        this.canOverlap = canOverlap;
    }

    getCanReorder(): XliffCanReorder | undefined {
        return this.canReorder;
    }

    setCanReorder(canReorder: XliffCanReorder | undefined): void {
        this.canReorder = canReorder;
    }

    getCopyOf(): string | undefined {
        return this.copyOf;
    }

    setCopyOf(copyOf: string | undefined): void {
        this.copyOf = copyOf;
    }

    getDataRef(): string | undefined {
        return this.dataRef;
    }

    setDataRef(dataRef: string | undefined): void {
        this.dataRef = dataRef;
    }

    getDir(): XliffDirection | undefined {
        return this.dir;
    }

    setDir(dir: XliffDirection | undefined): void {
        this.dir = dir;
    }

    getDisp(): string | undefined {
        return this.disp;
    }

    setDisp(disp: string | undefined): void {
        this.disp = disp;
    }

    getEquiv(): string | undefined {
        return this.equiv;
    }

    setEquiv(equiv: string | undefined): void {
        this.equiv = equiv;
    }

    getIsolated(): XliffYesNo | undefined {
        return this.isolated;
    }

    setIsolated(isolated: XliffYesNo | undefined): void {
        this.isolated = isolated;
    }

    getSubFlows(): string | undefined {
        return this.subFlows;
    }

    setSubFlows(subFlows: string | undefined): void {
        this.subFlows = subFlows;
    }

    getSubType(): XliffInlineSubType | undefined {
        return this.subType;
    }

    setSubType(subType: XliffInlineSubType | undefined): void {
        this.subType = subType;
    }

    getType(): XliffInlineType | undefined {
        return this.type;
    }

    setType(type: XliffInlineType | undefined): void {
        this.type = type;
    }

    getOtherAttributes(): Array<XMLAttribute> {
        return this.otherAttributes;
    }

    setOtherAttributes(otherAttributes: Array<XMLAttribute>): void {
        this.otherAttributes.length = 0;
        this.otherAttributes.push(...otherAttributes);
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
            this.errorReason = 'The @id attribute value "' + this.id + '" is not valid';
            return false;
        }
        if (this.canCopy !== undefined && this.canCopy !== "yes" && this.canCopy !== "no") {
            this.errorReason = 'The @canCopy attribute value "' + this.canCopy + '" is not valid';
            return false;
        }
        if (this.canDelete !== undefined && this.canDelete !== "yes" && this.canDelete !== "no") {
            this.errorReason = 'The @canDelete attribute value "' + this.canDelete + '" is not valid';
            return false;
        }
        if (this.canOverlap !== undefined && this.canOverlap !== "yes" && this.canOverlap !== "no") {
            this.errorReason = 'The @canOverlap attribute value "' + this.canOverlap + '" is not valid';
            return false;
        }
        if (this.canReorder !== undefined && this.canReorder !== "yes" && this.canReorder !== "firstNo" && this.canReorder !== "no") {
            this.errorReason = 'The @canReorder attribute value "' + this.canReorder + '" is not valid';
            return false;
        }
        if (this.copyOf !== undefined && !XMLUtils.isValidNMTOKEN(this.copyOf)) {
            this.errorReason = 'The @copyOf attribute value "' + this.copyOf + '" is not valid';
            return false;
        }
        if (this.dataRef !== undefined && !XMLUtils.isValidNMTOKEN(this.dataRef)) {
            this.errorReason = 'The @dataRef attribute value "' + this.dataRef + '" is not valid';
            return false;
        }
        if (this.dir !== undefined && this.dir !== "ltr" && this.dir !== "rtl" && this.dir !== "auto") {
            this.errorReason = 'The @dir attribute value "' + this.dir + '" is not valid';
            return false;
        }
        if (this.isolated !== undefined && this.isolated !== "yes" && this.isolated !== "no") {
            this.errorReason = 'The @isolated attribute value "' + this.isolated + '" is not valid';
            return false;
        }
        if (this.subFlows !== undefined && !this.subFlows.split(/\s+/).every((item) => XMLUtils.isValidNMTOKEN(item))) {
            this.errorReason = 'The @subFlows attribute value "' + this.subFlows + '" is not valid';
            return false;
        }
        if (this.type !== undefined && this.type !== "fmt" && this.type !== "ui" && this.type !== "quote" && this.type !== "link" && this.type !== "image" && this.type !== "other") {
            this.errorReason = 'The @type attribute value "' + this.type + '" is not valid';
            return false;
        }
        if (this.copyOf !== undefined && this.dataRef !== undefined) {
            this.errorReason = 'The @copyOf and @dataRef attributes cannot both be present';
            return false;
        }
        if (this.canReorder === "no" || this.canReorder === "firstNo") {
            if (this.canCopy !== "no" || this.canDelete !== "no") {
                this.errorReason = 'The @canReorder attribute value is "' + this.canReorder + '" but @canCopy or @canDelete is not "no"';
                return false;
            }
        }
        if (this.subType !== undefined) {
            if (this.type === undefined) {
                this.errorReason = 'The @subType attribute value is set but @type is not set';
                return false;
            }
            if (!this.subType.includes(':') || this.subType.startsWith(':') || this.subType.endsWith(':')) {
                this.errorReason = 'The @subType attribute value "' + this.subType + '" is not valid';
                return false;
            }
            if ((this.subType === 'xlf:b' || this.subType === 'xlf:i' || this.subType === 'xlf:u' || this.subType === 'xlf:lb' || this.subType === 'xlf:pb') && this.type !== 'fmt') {
                this.errorReason = 'The @subType attribute value "' + this.subType + '" is not valid for @type "' + this.type + '"';
                return false;
            }
            if (this.subType === 'xlf:var' && this.type !== 'ui') {
                this.errorReason = 'The @subType attribute value "' + this.subType + '" is not valid for @type "' + this.type + '"';
                return false;
            }
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        const attributes: Array<[string, string | undefined]> = [
            ["id", this.id],
            ["canCopy", this.canCopy],
            ["canDelete", this.canDelete],
            ["canOverlap", this.canOverlap],
            ["canReorder", this.canReorder],
            ["copyOf", this.copyOf],
            ["dataRef", this.dataRef],
            ["dir", this.dir],
            ["disp", this.disp],
            ["equiv", this.equiv],
            ["isolated", this.isolated],
            ["subFlows", this.subFlows],
            ["subType", this.subType],
            ["type", this.type]
        ];
        for (const [name, value] of attributes) {
            if (value !== undefined) {
                element.setAttribute(new XMLAttribute(name, value));
            }
        }
        for (const otherAttribute of this.otherAttributes) {
            element.setAttribute(otherAttribute);
        }
        return element;
    }

    getValidationError(): string {
        return this.errorReason;
    }
}
