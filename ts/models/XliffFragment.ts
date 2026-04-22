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

import { XMLUtils } from "typesxml";

export function isValidFragmentIdentifier(value: string): boolean {
    if (value.trim().length === 0 || !value.startsWith('#')) {
        return false;
    }

    const expression: string = value.slice(1);
    if (expression.length === 0) {
        return false;
    }

    const selectors: Array<string> = (expression.startsWith('/') ? expression.slice(1) : expression).split('/');
    if (selectors.length === 0 || selectors.some((selector) => selector.length === 0)) {
        return false;
    }

    const seenPrefixes: Set<string> = new Set<string>();
    const coreOrder: Record<string, number> = { f: 0, g: 1, u: 2 };
    let lastCoreOrder: number = -1;
    let terminalSelectorSeen: boolean = false;

    for (let index: number = 0; index < selectors.length; index++) {
        const selector: string = selectors[index];
        const separatorIndex: number = selector.indexOf('=');

        if (separatorIndex === -1) {
            if (!XMLUtils.isValidNMTOKEN(selector)) {
                return false;
            }
            if (terminalSelectorSeen || index !== selectors.length - 1) {
                return false;
            }
            terminalSelectorSeen = true;
            continue;
        }

        if (separatorIndex === 0 || separatorIndex !== selector.lastIndexOf('=')) {
            return false;
        }

        const prefix: string = selector.slice(0, separatorIndex);
        const id: string = selector.slice(separatorIndex + 1);

        if (!XMLUtils.isValidNMTOKEN(prefix) || !XMLUtils.isValidNMTOKEN(id)) {
            return false;
        }
        if (seenPrefixes.has(prefix)) {
            return false;
        }
        seenPrefixes.add(prefix);

        if (prefix === 'f' || prefix === 'g' || prefix === 'u') {
            const currentCoreOrder: number = coreOrder[prefix];
            if (currentCoreOrder <= lastCoreOrder) {
                return false;
            }
            lastCoreOrder = currentCoreOrder;
            continue;
        }

        if (prefix.length === 1 && prefix !== 'n' && prefix !== 'd' && prefix !== 't') {
            return false;
        }
        if (terminalSelectorSeen || index !== selectors.length - 1) {
            return false;
        }
        terminalSelectorSeen = true;
    }

    return true;
}
