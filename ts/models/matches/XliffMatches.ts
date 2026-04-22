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
import type { XliffMatch } from "./XliffMatch.js";
import { ModuleElement } from "../moduleElement.js";

export class XliffMatches implements XliffElement , ModuleElement{

    readonly elementName: string = "matches";
    readonly matches: Array<XliffMatch> = [];
    prefix?: string;

    getMatches(): Array<XliffMatch> {
        return this.matches;
    }

    setMatches(matches: Array<XliffMatch>): void {
        this.matches.length = 0;
        this.matches.push(...matches);
    }

    addMatch(match: XliffMatch): void {
        this.matches.push(match);
    }

    isValid(): boolean {
        if (this.matches.length === 0) {
            return false;
        }
        const ids: Set<string> = new Set<string>();
        for (const match of this.matches) {
            if (!match.isValid()) {
                return false;
            }
            if (match.id !== undefined) {
                if (ids.has(match.id)) {
                    return false;
                }
                ids.add(match.id);
            }
        }
        return true;
    }

    toElement(): XMLElement {
        const element: XMLElement = new XMLElement(this.prefix ? this.prefix + ':' + this.elementName : this.elementName);
        for (const match of this.matches) {
            element.addElement(match.toElement());
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