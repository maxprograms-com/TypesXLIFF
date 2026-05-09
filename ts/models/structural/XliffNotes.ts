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
import { XliffElement } from "../XliffElement.js";
import type { XliffNote } from "./XliffNote.js";

export class XliffNotes implements XliffElement {

    readonly elementName: string = "notes";
    errorReason: string = '';
    readonly notes: Array<XliffNote> = [];

    getNotes(): Array<XliffNote> {
        return this.notes;
    }

    setNotes(notes: Array<XliffNote>): void {
        this.notes.length = 0;
        this.notes.push(...notes);
    }

    addNote(note: XliffNote): void {
        this.notes.push(note);
    }

    isValid(): boolean {
        if (this.notes.length === 0) {
            this.errorReason = 'The <notes> element must contain at least one <note> element';
            return false;
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.elementName);
        for (const note of this.notes) {
            element.addElement(note.toElement());
        }
        return element;
    }

    getValidationError(): string {
        return this.errorReason;
    }
}
