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
import type { XliffCp } from "./XliffCp.js";
import type { XliffEc } from "./XliffEc.js";
import type { XliffEm } from "./XliffEm.js";
import type { XliffMrk } from "./XliffMrk.js";
import type { XliffPh } from "./XliffPh.js";
import type { XliffSc } from "./XliffSc.js";
import type { XliffSm } from "./XliffSm.js";

export class XliffPc implements XliffElement {

    readonly elementName: string = "pc";
    id: string;
    canCopy?: XliffYesNo;
    canDelete?: XliffYesNo;
    canOverlap?: XliffYesNo;
    canReorder?: XliffCanReorder;
    copyOf?: string;
    dispEnd?: string;
    dispStart?: string;
    equivEnd?: string;
    equivStart?: string;
    dataRefEnd?: string;
    dataRefStart?: string;
    subFlowsEnd?: string;
    subFlowsStart?: string;
    subType?: XliffInlineSubType;
    type?: XliffInlineType;
    dir?: XliffDirection;
    errorReason: string = '';
    readonly content: Array<string | XliffCp | XliffPh | XliffPc | XliffSc | XliffEc | XliffMrk | XliffSm | XliffEm> = [];
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

    getDispEnd(): string | undefined {
        return this.dispEnd;
    }

    setDispEnd(dispEnd: string | undefined): void {
        this.dispEnd = dispEnd;
    }

    getDispStart(): string | undefined {
        return this.dispStart;
    }

    setDispStart(dispStart: string | undefined): void {
        this.dispStart = dispStart;
    }

    getEquivEnd(): string | undefined {
        return this.equivEnd;
    }

    setEquivEnd(equivEnd: string | undefined): void {
        this.equivEnd = equivEnd;
    }

    getEquivStart(): string | undefined {
        return this.equivStart;
    }

    setEquivStart(equivStart: string | undefined): void {
        this.equivStart = equivStart;
    }

    getDataRefEnd(): string | undefined {
        return this.dataRefEnd;
    }

    setDataRefEnd(dataRefEnd: string | undefined): void {
        this.dataRefEnd = dataRefEnd;
    }

    getDataRefStart(): string | undefined {
        return this.dataRefStart;
    }

    setDataRefStart(dataRefStart: string | undefined): void {
        this.dataRefStart = dataRefStart;
    }

    getSubFlowsEnd(): string | undefined {
        return this.subFlowsEnd;
    }

    setSubFlowsEnd(subFlowsEnd: string | undefined): void {
        this.subFlowsEnd = subFlowsEnd;
    }

    getSubFlowsStart(): string | undefined {
        return this.subFlowsStart;
    }

    setSubFlowsStart(subFlowsStart: string | undefined): void {
        this.subFlowsStart = subFlowsStart;
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

    getDir(): XliffDirection | undefined {
        return this.dir;
    }

    setDir(dir: XliffDirection | undefined): void {
        this.dir = dir;
    }

    getContent(): Array<string | XliffCp | XliffPh | XliffPc | XliffSc | XliffEc | XliffMrk | XliffSm | XliffEm> {
        return this.content;
    }

    setContent(content: Array<string | XliffCp | XliffPh | XliffPc | XliffSc | XliffEc | XliffMrk | XliffSm | XliffEm>): void {
        this.content.length = 0;
        this.content.push(...content);
    }

    getOtherAttributes(): Array<XMLAttribute> {
        return this.otherAttributes;
    }

    setOtherAttributes(otherAttributes: Array<XMLAttribute>): void {
        this.otherAttributes.length = 0;
        this.otherAttributes.push(...otherAttributes);
    }

    addText(text: string): void {
        this.content.push(text);
    }

    addCp(cp: XliffCp): void {
        this.content.push(cp);
    }

    addPh(ph: XliffPh): void {
        this.content.push(ph);
    }

    addPc(pc: XliffPc): void {
        this.content.push(pc);
    }

    addSc(sc: XliffSc): void {
        this.content.push(sc);
    }

    addEc(ec: XliffEc): void {
        this.content.push(ec);
    }

    addMrk(mrk: XliffMrk): void {
        this.content.push(mrk);
    }

    addSm(sm: XliffSm): void {
        this.content.push(sm);
    }

    addEm(em: XliffEm): void {
        this.content.push(em);
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
            this.errorReason = 'The @id attribute value "' + this.id + '" is not a valid NMTOKEN';
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
        if (this.dataRefStart !== undefined && !XMLUtils.isValidNMTOKEN(this.dataRefStart)) {
            this.errorReason = 'The @dataRefStart attribute value "' + this.dataRefStart + '" is not valid';
            return false;
        }
        if (this.dataRefEnd !== undefined && !XMLUtils.isValidNMTOKEN(this.dataRefEnd)) {
            this.errorReason = 'The @dataRefEnd attribute value "' + this.dataRefEnd + '" is not valid';
            return false;
        }
        if (this.subFlowsStart !== undefined && !this.subFlowsStart.split(/\s+/).every((item) => XMLUtils.isValidNMTOKEN(item))) {
            this.errorReason = 'The @subFlowsStart attribute value "' + this.subFlowsStart + '" is not valid';
            return false;
        }
        if (this.subFlowsEnd !== undefined && !this.subFlowsEnd.split(/\s+/).every((item) => XMLUtils.isValidNMTOKEN(item))) {
            this.errorReason = 'The @subFlowsEnd attribute value "' + this.subFlowsEnd + '" is not valid';
            return false;
        }
        if (this.dir !== undefined && this.dir !== "ltr" && this.dir !== "rtl" && this.dir !== "auto") {
            this.errorReason = 'The @dir attribute value "' + this.dir + '" is not valid';
            return false;
        }
        if (this.type !== undefined && this.type !== "fmt" && this.type !== "ui" && this.type !== "quote" && this.type !== "link" && this.type !== "image" && this.type !== "other") {
            this.errorReason = 'The @type attribute value "' + this.type + '" is not valid';
            return false;
        }
        if (this.copyOf !== undefined && (this.dataRefStart !== undefined || this.dataRefEnd !== undefined)) {
            this.errorReason = 'The @copyOf attribute value is set but @dataRefStart or @dataRefEnd is also set';
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
            ["dispStart", this.dispStart],
            ["dispEnd", this.dispEnd],
            ["equivStart", this.equivStart],
            ["equivEnd", this.equivEnd],
            ["dataRefStart", this.dataRefStart],
            ["dataRefEnd", this.dataRefEnd],
            ["subFlowsStart", this.subFlowsStart],
            ["subFlowsEnd", this.subFlowsEnd],
            ["subType", this.subType],
            ["type", this.type],
            ["dir", this.dir]
        ];
        for (const [name, value] of attributes) {
            if (value !== undefined) {
                element.setAttribute(new XMLAttribute(name, value));
            }
        }
        for (const otherAttribute of this.otherAttributes) {
            element.setAttribute(otherAttribute);
        }
        for (const item of this.content) {
            if (typeof item === "string") {
                element.addString(item);
            } else {
                element.addElement(item.toElement());
            }
        }
        return element;
    }

    getValidationError(): string {
        return this.errorReason;
    }
}
