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

import { Catalog, ContentHandler, Grammar, TextNode, XMLAttribute, XMLElement } from "typesxml";
import { XliffDefinition } from "../models/glossary/XliffDefinition.js";
import { XliffGlossary } from "../models/glossary/XliffGlossary.js";
import { XliffGlossEntry } from "../models/glossary/XliffGlossEntry.js";
import { XliffTerm } from "../models/glossary/XliffTerm.js";
import { XliffTranslation } from "../models/glossary/XliffTranslation.js";
import { XliffCp } from "../models/inline/XliffCp.js";
import { XliffEc } from "../models/inline/XliffEc.js";
import { XliffEm } from "../models/inline/XliffEm.js";
import { XliffMrk } from "../models/inline/XliffMrk.js";
import { XliffPc } from "../models/inline/XliffPc.js";
import { XliffPh } from "../models/inline/XliffPh.js";
import { XliffSc } from "../models/inline/XliffSc.js";
import { XliffSm } from "../models/inline/XliffSm.js";
import { XliffMatch } from "../models/matches/XliffMatch.js";
import { XliffMatches } from "../models/matches/XliffMatches.js";
import { XliffMeta } from "../models/metadata/XliffMeta.js";
import { XliffMetadata } from "../models/metadata/XliffMetadata.js";
import { XliffMetaGroup } from "../models/metadata/XliffMetaGroup.js";
import { XliffData } from "../models/structural/XliffData.js";
import { XliffDocument } from "../models/structural/XliffDocument.js";
import { XliffFile } from "../models/structural/XliffFile.js";
import { XliffGroup } from "../models/structural/XliffGroup.js";
import { XliffIgnorable } from "../models/structural/XliffIgnorable.js";
import { XliffNote } from "../models/structural/XliffNote.js";
import { XliffNotes } from "../models/structural/XliffNotes.js";
import { XliffOriginalData } from "../models/structural/XliffOriginalData.js";
import { XliffSegment } from "../models/structural/XliffSegment.js";
import { XliffSkeleton } from "../models/structural/XliffSkeleton.js";
import { XliffSource } from "../models/structural/XliffSource.js";
import { XliffTarget } from "../models/structural/XliffTarget.js";
import { XliffUnit } from "../models/structural/XliffUnit.js";
import { XliffElement } from "../models/XliffElement.js";
import type {
    XliffAnnotationType, XliffCanReorder, XliffDataXmlSpace, XliffDirection,
    XliffInlineSubType, XliffInlineType, XliffMatchType,
    XliffMetaGroupAppliesTo, XliffNoteAppliesTo, XliffNotePriority, XliffSegmentState,
    XliffVersion, XliffXmlSpace, XliffYesNo
} from "../models/XliffTypes.js";

export class XliffContentHandler implements ContentHandler {
    catalog: Catalog | undefined;
    inCdata: boolean = false;
    stack: Array<XMLElement> = [];
    xliffStack: Array<XliffElement> = [];
    xliffDocument: XliffDocument | undefined;
    grammar: Grammar | undefined;

    initialize(): void {
        this.inCdata = false;
        this.stack = [];
        this.xliffStack = [];
        this.xliffDocument = undefined;
        this.grammar = undefined;
    }

    getXliffDocument(): XliffDocument | undefined {
        return this.xliffDocument;
    }

    setCatalog(catalog: Catalog): void {
        this.catalog = catalog;
    }

    startDocument(): void {
        // do nothing
    }

    endDocument(): void {
        // do nothing
    }

    xmlDeclaration(version: string, encoding: string, standalone: string | undefined): void {
        // do nothing
    }

    startElement(name: string, atts: Array<XMLAttribute>): void {
        let element: XMLElement = new XMLElement(name);
        let localName: string = name;
        if (name.includes(':')) {
            localName = name.substring(name.indexOf(':') + 1);
        }
        for (const att of atts) {
            element.setAttribute(att);
        }
        if (this.stack.length > 0) {
            this.stack[this.stack.length - 1].addElement(element);
        } else {
            if (name === 'xliff') {
                let version: string | undefined = element.getAttribute('version')?.getValue();
                let srcLang: string | undefined = element.getAttribute('srcLang')?.getValue();
                let trgtLang: string | undefined = element.getAttribute('trgLang')?.getValue();
                if (version === undefined) {
                    throw new Error('Missing required "version" attribute on <xliff> element');
                }
                if (srcLang === undefined) {
                    throw new Error('Missing required "srcLang" attribute on <xliff> element');
                }
                if (version !== '2.0' && version !== '2.1' && version !== '2.2') {
                    throw new Error('Unsupported XLIFF version: ' + version);
                }
                let xliffVersion: XliffVersion = version as XliffVersion;
                this.xliffDocument = new XliffDocument(xliffVersion, srcLang, trgtLang);
                let xmlSpace: string | undefined = element.getAttribute('xml:space')?.getValue();
                if (xmlSpace !== undefined) {
                    if (xmlSpace !== 'preserve' && xmlSpace !== 'default') {
                        throw new Error('Invalid value for "xml:space" attribute on <xliff> element: ' + xmlSpace);
                    }
                    this.xliffDocument.setXmlSpace(xmlSpace as XliffXmlSpace);
                }
                const xliffAtts: Set<string> = new Set<string>(['version', 'srcLang', 'trgLang', 'xml:space']);
                let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
                this.xliffDocument.setOtherAttributes(otherAtts);
                this.xliffStack.push(this.xliffDocument);
            } else {
                throw new Error('Root element must be <xliff>');
            }
        }
        // Core elements
        if (name === 'file') {
            this.buildFile(element);
        } else if (name === 'group') {
            this.buildGroup(element);
        } else if (name === 'unit') {
            this.buildUnit(element);
        } else if (name === 'segment') {
            this.buildSegment(element);
        } else if (name === 'ignorable') {
            this.buildIgnorable(element);
        } else if (name === 'source') {
            this.buildSource(element);
        } else if (name === 'target') {
            this.buildTarget(element);
        } else if (name === 'notes') {
            this.buildNotes();
        } else if (name === 'note') {
            this.buildNote(element);
        } else if (name === 'skeleton') {
            this.buildSkeleton(element);
        } else if (name === 'originalData') {
            this.buildOriginalData(element);
        } else if (name === 'data') {
            this.buildData(element);
            // Metadata elements
        } else if (localName === 'metadata') {
            this.buildMetadata(element);
        } else if (localName === 'metaGroup') {
            this.buildMetaGroup(element);
        } else if (localName === 'meta') {
            this.buildMeta(element);
            // Glossary elements
        } else if (localName === 'glossary') {
            this.buildGlossary(element);
        } else if (localName === 'glossEntry') {
            this.buildGlossEntry(element);
        } else if (localName === 'term') {
            this.buildTerm(element);
        } else if (localName === 'translation') {
            this.buildTranslation(element);
        } else if (localName === 'definition') {
            this.buildDefinition(element);
            // Translation Candidates Module
        } else if (localName === 'matches') {
            this.buildMatches(element);
        } else if (localName === 'match') {
            this.buildMatch(element);
            // Inline elements
        } else if (name === 'cp') {
            this.buildCp(element);
        } else if (name === 'ph') {
            this.buildPh(element);
        } else if (name === 'pc') {
            this.buildPc(element);
        } else if (name === 'sc') {
            this.buildSc(element);
        } else if (name === 'ec') {
            this.buildEc(element);
        } else if (name === 'mrk') {
            this.buildMrk(element);
        } else if (name === 'sm') {
            this.buildSm(element);
        } else if (name === 'em') {
            this.buildEm(element);
        }
        this.stack.push(element);
    }

    endElement(name: string): void {
        let closedElement: XMLElement = this.stack[this.stack.length - 1];
        this.stack.pop();
        let localname: string = name.indexOf(':') !== -1 ? name.substring(name.indexOf(':') + 1) : name;
        let xliffElements: string[] = ['xliff', 'file', 'group', 'unit', 'segment', 'ignorable', 'source',
            'target', 'notes', 'note', 'skeleton', 'originalData', 'data', 'metadata', 'metaGroup',
            'meta', 'glossary', 'glossEntry', 'term', 'translation', 'definition', 'matches', 'match',
            'cp', 'ph', 'pc', 'sc', 'ec', 'mrk', 'sm', 'em'];
        if (xliffElements.includes(localname)) {
            this.xliffStack.pop();
        } else if (this.stack.length > 0 && this.xliffStack.length > 0) {
            let parentName: string = this.stack[this.stack.length - 1].getName();
            let parentLocalName: string = parentName.indexOf(':') !== -1 ? parentName.substring(parentName.indexOf(':') + 1) : parentName;
            let xliffParent = this.xliffStack[this.xliffStack.length - 1];
            if (parentLocalName === 'file' && xliffParent instanceof XliffFile) {
                xliffParent.addOtherElement(closedElement);
            } else if (parentLocalName === 'group' && xliffParent instanceof XliffGroup) {
                xliffParent.addOtherElement(closedElement);
            } else if (parentLocalName === 'unit' && xliffParent instanceof XliffUnit) {
                xliffParent.addOtherElement(closedElement);
            } else if (parentLocalName === 'skeleton' && xliffParent instanceof XliffSkeleton) {
                xliffParent.addOtherElement(closedElement);
            } else if (parentLocalName === 'match' && xliffParent instanceof XliffMatch) {
                xliffParent.addOtherElement(closedElement);
            } else if (parentLocalName === 'glossEntry' && xliffParent instanceof XliffGlossEntry) {
                xliffParent.addOtherElement(closedElement);
            }
        }
    }

    internalSubset(declaration: string): void {
        throw new Error('Method not implemented.');
    }

    characters(ch: string): void {
        if (!this.inCdata) {
            if (this.stack.length === 0) {
                return;
            }
            let stackTop: XMLElement = this.stack[this.stack.length - 1];
            let topName: string = stackTop.getName();
            let topLocalName: string = topName.indexOf(':') !== -1 ? topName.substring(topName.indexOf(':') + 1) : topName;
            let xliffTextElements: string[] = ['definition', 'term', 'translation', 'source',
                'mrk', 'pc', 'meta', 'data', 'note', 'skeleton', 'target'];
            if (xliffTextElements.includes(topLocalName) && this.xliffStack.length > 0) {
                let xliffParent = this.xliffStack[this.xliffStack.length - 1];
                if (xliffParent instanceof XliffDefinition || xliffParent instanceof XliffTerm ||
                    xliffParent instanceof XliffTranslation || xliffParent instanceof XliffSource ||
                    xliffParent instanceof XliffMrk || xliffParent instanceof XliffPc ||
                    xliffParent instanceof XliffMeta || xliffParent instanceof XliffData ||
                    xliffParent instanceof XliffNote || xliffParent instanceof XliffSkeleton ||
                    xliffParent instanceof XliffTarget) {
                    xliffParent.addText(ch);
                }
            } else {
                let xliffElements: string[] = ['xliff', 'file', 'group', 'unit', 'segment', 'ignorable',
                    'source', 'target', 'notes', 'note', 'skeleton', 'originalData', 'data', 'metadata',
                    'metaGroup', 'meta', 'glossary', 'glossEntry', 'term', 'translation', 'definition',
                    'matches', 'match', 'cp', 'ph', 'pc', 'sc', 'ec', 'mrk', 'sm', 'em'];
                if (!xliffElements.includes(topLocalName)) {
                    stackTop.addTextNode(new TextNode(ch));
                }
            }
        }
    }

    ignorableWhitespace(ch: string): void {
        // do nothing
    }

    comment(ch: string): void {
        // do nothing
    }

    processingInstruction(target: string, data: string): void {
        // do nothing
    }

    startCDATA(): void {
        this.inCdata = true;
    }

    endCDATA(): void {
        this.inCdata = false;
    }

    startDTD(name: string, publicId: string, systemId: string): void {
        // do nothing
    }

    endDTD(): void {
        // do nothing
    }

    skippedEntity(name: string): void {
        throw new Error('Method not implemented.');
    }

    getGrammar(): Grammar | undefined {
        return this.grammar;
    }

    setGrammar(grammar: Grammar | undefined): void {
        this.grammar = grammar;
    }

    buildFile(element: XMLElement) {
        if (!this.xliffDocument) {
            throw new Error('<file> element must be a child of <xliff>');
        }
        let id: string | undefined = element.getAttribute('id')?.getValue();
        if (id === undefined) {
            throw new Error('Missing required "id" attribute on <file> element');
        }
        let original: string | undefined = element.getAttribute('original')?.getValue();
        let file: XliffFile = new XliffFile(id, original);
        let canResegment: string | undefined = element.getAttribute('canResegment')?.getValue();
        if (canResegment !== undefined) {
            if (canResegment !== 'yes' && canResegment !== 'no') {
                throw new Error('Invalid value for "canResegment" attribute on <file> element: ' + canResegment);
            }
            file.setCanResegment(canResegment as XliffYesNo);
        }
        let translate: string | undefined = element.getAttribute('translate')?.getValue();
        if (translate !== undefined) {
            if (translate !== 'yes' && translate !== 'no') {
                throw new Error('Invalid value for "translate" attribute on <file> element: ' + translate);
            }
            file.setTranslate(translate as XliffYesNo);
        }
        let srcDir: string | undefined = element.getAttribute('srcDir')?.getValue();
        if (srcDir !== undefined) {
            if (srcDir !== 'ltr' && srcDir !== 'rtl' && srcDir !== 'auto') {
                throw new Error('Invalid value for "srcDir" attribute on <file> element: ' + srcDir);
            }
            file.setSrcDir(srcDir as XliffDirection);
        }
        let trgDir: string | undefined = element.getAttribute('trgDir')?.getValue();
        if (trgDir !== undefined) {
            if (trgDir !== 'ltr' && trgDir !== 'rtl' && trgDir !== 'auto') {
                throw new Error('Invalid value for "trgDir" attribute on <file> element: ' + trgDir);
            }
            file.setTrgDir(trgDir as XliffDirection);
        }
        let xmlSpace: string | undefined = element.getAttribute('xml:space')?.getValue();
        if (xmlSpace !== undefined) {
            if (xmlSpace !== 'preserve' && xmlSpace !== 'default') {
                throw new Error('Invalid value for "xml:space" attribute on <file> element: ' + xmlSpace);
            }
            file.setXmlSpace(xmlSpace as XliffXmlSpace);
        }
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['id', 'original', 'canResegment', 'translate', 'srcDir', 'trgDir', 'xml:space']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        file.setOtherAttributes(otherAtts);
        this.xliffDocument.addFile(file);
        this.xliffStack.push(file);
    }

    buildGroup(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        if (id === undefined) {
            throw new Error('Missing required "id" attribute on <group> element');
        }
        let group: XliffGroup = new XliffGroup(id);
        let name: string | undefined = element.getAttribute('name')?.getValue();
        if (name !== undefined) {
            group.setName(name);
        }
        let canResegment: string | undefined = element.getAttribute('canResegment')?.getValue();
        if (canResegment !== undefined) {
            if (canResegment !== 'yes' && canResegment !== 'no') {
                throw new Error('Invalid value for "canResegment" attribute on <group> element: ' + canResegment);
            }
            group.setCanResegment(canResegment as XliffYesNo);
        }
        let translate: string | undefined = element.getAttribute('translate')?.getValue();
        if (translate !== undefined) {
            if (translate !== 'yes' && translate !== 'no') {
                throw new Error('Invalid value for "translate" attribute on <group> element: ' + translate);
            }
            group.setTranslate(translate as XliffYesNo);
        }
        let srcDir: string | undefined = element.getAttribute('srcDir')?.getValue();
        if (srcDir !== undefined) {
            if (srcDir !== 'ltr' && srcDir !== 'rtl' && srcDir !== 'auto') {
                throw new Error('Invalid value for "srcDir" attribute on <group> element: ' + srcDir);
            }
            group.setSrcDir(srcDir as XliffDirection);
        }
        let trgDir: string | undefined = element.getAttribute('trgDir')?.getValue();
        if (trgDir !== undefined) {
            if (trgDir !== 'ltr' && trgDir !== 'rtl' && trgDir !== 'auto') {
                throw new Error('Invalid value for "trgDir" attribute on <group> element: ' + trgDir);
            }
            group.setTrgDir(trgDir as XliffDirection);
        }
        let type: string | undefined = element.getAttribute('type')?.getValue();
        if (type !== undefined) {
            group.setType(type);
        }
        let xmlSpace: string | undefined = element.getAttribute('xml:space')?.getValue();
        if (xmlSpace !== undefined) {
            if (xmlSpace !== 'preserve' && xmlSpace !== 'default') {
                throw new Error('Invalid value for "xml:space" attribute on <group> element: ' + xmlSpace);
            }
            group.setXmlSpace(xmlSpace as XliffXmlSpace);
        }
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['id', 'name', 'canResegment', 'translate', 'srcDir', 'trgDir', 'type', 'xml:space']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        group.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffFile || parent instanceof XliffGroup) {
            parent.addGroup(group);
            this.xliffStack.push(group);
        } else {
            throw new Error('<group> element must be a child of <file> or <group>');
        }
    }

    buildUnit(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        if (id === undefined) {
            throw new Error('Missing required "id" attribute on <unit> element');
        }
        let unit: XliffUnit = new XliffUnit(id);
        let name: string | undefined = element.getAttribute('name')?.getValue();
        if (name !== undefined) {
            unit.setName(name);
        }
        let canResegment: string | undefined = element.getAttribute('canResegment')?.getValue();
        if (canResegment !== undefined) {
            if (canResegment !== 'yes' && canResegment !== 'no') {
                throw new Error('Invalid value for "canResegment" attribute on <unit> element: ' + canResegment);
            }
            unit.setCanResegment(canResegment as XliffYesNo);
        }
        let translate: string | undefined = element.getAttribute('translate')?.getValue();
        if (translate !== undefined) {
            if (translate !== 'yes' && translate !== 'no') {
                throw new Error('Invalid value for "translate" attribute on <unit> element: ' + translate);
            }
            unit.setTranslate(translate as XliffYesNo);
        }
        let srcDir: string | undefined = element.getAttribute('srcDir')?.getValue();
        if (srcDir !== undefined) {
            if (srcDir !== 'ltr' && srcDir !== 'rtl' && srcDir !== 'auto') {
                throw new Error('Invalid value for "srcDir" attribute on <unit> element: ' + srcDir);
            }
            unit.setSrcDir(srcDir as XliffDirection);
        }
        let trgDir: string | undefined = element.getAttribute('trgDir')?.getValue();
        if (trgDir !== undefined) {
            if (trgDir !== 'ltr' && trgDir !== 'rtl' && trgDir !== 'auto') {
                throw new Error('Invalid value for "trgDir" attribute on <unit> element: ' + trgDir);
            }
            unit.setTrgDir(trgDir as XliffDirection);
        }
        let xmlSpace: string | undefined = element.getAttribute('xml:space')?.getValue();
        if (xmlSpace !== undefined) {
            if (xmlSpace !== 'preserve' && xmlSpace !== 'default') {
                throw new Error('Invalid value for "xml:space" attribute on <unit> element: ' + xmlSpace);
            }
            unit.setXmlSpace(xmlSpace as XliffXmlSpace);
        }
        let type: string | undefined = element.getAttribute('type')?.getValue();
        if (type !== undefined) {
            unit.setType(type);
        }
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['id', 'name', 'canResegment', 'translate', 'srcDir', 'trgDir', 'xml:space', 'type']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        unit.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (!(parent instanceof XliffFile || parent instanceof XliffGroup)) {
            throw new Error('<unit> element must be a child of <file> or <group>');
        }
        parent.addUnit(unit);
        this.xliffStack.push(unit);
    }

    buildSegment(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        let segment: XliffSegment = new XliffSegment(id);
        let canResegment: string | undefined = element.getAttribute('canResegment')?.getValue();
        if (canResegment !== undefined) {
            if (canResegment !== 'yes' && canResegment !== 'no') {
                throw new Error('Invalid value for "canResegment" attribute on <segment> element: ' + canResegment);
            }
            segment.setCanResegment(canResegment as XliffYesNo);
        }
        let state: string | undefined = element.getAttribute('state')?.getValue();
        if (state !== undefined) {
            segment.setState(state as XliffSegmentState);
        }
        let subState: string | undefined = element.getAttribute('subState')?.getValue();
        if (subState !== undefined) {
            segment.setSubState(subState);
        }
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (!(parent instanceof XliffUnit)) {
            throw new Error('<segment> element must be a child of <unit>');
        }
        parent.addSegment(segment);
        this.xliffStack.push(segment);
    }

    buildIgnorable(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        let ignorable: XliffIgnorable = new XliffIgnorable(id);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffUnit) {
            parent.addIgnorable(ignorable);
            this.xliffStack.push(ignorable);
        } else {
            throw new Error('<ignorable> element must be a child of <unit>');
        }
    }

    buildSource(element: XMLElement) {
        let xmlSpace: string | undefined = element.getAttribute('xml:space')?.getValue();
        if (xmlSpace !== undefined) {
            if (xmlSpace !== 'preserve' && xmlSpace !== 'default') {
                throw new Error('Invalid value for "xml:space" attribute on <source> element: ' + xmlSpace);
            }
        }
        let xmlLang: string | undefined = element.getAttribute('xml:lang')?.getValue();
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffSegment || parent instanceof XliffIgnorable || parent instanceof XliffMatch) {
            let source = new XliffSource();
            source.setXmlSpace(xmlSpace as XliffXmlSpace | undefined);
            if (xmlLang !== undefined) {
                source.setXmlLang(xmlLang);
            }
            parent.setSource(source);
            this.xliffStack.push(source);
        } else {
            throw new Error('<source> element must be a child of <segment>, <ignorable>, or <match>');
        }
    }

    buildTarget(element: XMLElement) {
        let xmlSpace: string | undefined = element.getAttribute('xml:space')?.getValue();
        if (xmlSpace !== undefined) {
            if (xmlSpace !== 'preserve' && xmlSpace !== 'default') {
                throw new Error('Invalid value for "xml:space" attribute on <target> element: ' + xmlSpace);
            }
        }
        let xmlLang: string | undefined = element.getAttribute('xml:lang')?.getValue();
        let parent = this.xliffStack[this.xliffStack.length - 1];
        let order: string | undefined = element.getAttribute('order')?.getValue();
        let orderValue: number | undefined;
        if (order !== undefined) {
            if (!/^[1-9][0-9]*$/.test(order)) {
                throw new Error('Invalid value for "order" attribute on <target> element: ' + order);
            }
            orderValue = Number(order);
        }
        if (parent instanceof XliffSegment || parent instanceof XliffIgnorable || parent instanceof XliffMatch) {
            let target = new XliffTarget();
            target.setXmlSpace(xmlSpace as XliffXmlSpace | undefined);
            if (xmlLang !== undefined) {
                target.setXmlLang(xmlLang);
            }
            if (orderValue !== undefined) {
                target.setOrder(orderValue);
            }
            parent.setTarget(target);
            this.xliffStack.push(target);
        } else {
            throw new Error('<target> element must be a child of <segment>, <ignorable>, or <match>');
        }
    }

    buildNotes() {
        let notes: XliffNotes = new XliffNotes();
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffDocument || parent instanceof XliffFile || parent instanceof XliffGroup || parent instanceof XliffUnit) {
            parent.setNotes(notes);
            this.xliffStack.push(notes);
        } else {
            throw new Error('<notes> element must be a child of <xliff>, <file>, <group>, or <unit>');
        }
    }

    buildNote(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        let appliesTo: string | undefined = element.getAttribute('appliesTo')?.getValue();
        if (appliesTo !== undefined) {
            if (appliesTo !== 'source' && appliesTo !== 'target') {
                throw new Error('Invalid value for "appliesTo" attribute on <note> element: ' + appliesTo);
            }
        }
        let note: XliffNote = new XliffNote(id);
        if (appliesTo !== undefined) {
            note.setAppliesTo(appliesTo as XliffNoteAppliesTo);
        }
        let category: string | undefined = element.getAttribute('category')?.getValue();
        if (category !== undefined) {
            note.setCategory(category);
        }
        let priority: string | undefined = element.getAttribute('priority')?.getValue();
        if (priority !== undefined) {
            note.setPriority(priority as unknown as XliffNotePriority);
        }
        let ref: string | undefined = element.getAttribute('ref')?.getValue();
        if (ref !== undefined) {
            note.setRef(ref);
        }
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['id', 'appliesTo', 'category', 'priority', 'ref']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        note.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffNotes) {
            parent.addNote(note);
            this.xliffStack.push(note);
        } else {
            throw new Error('<note> element must be a child of <notes>');
        }
    }

    buildSkeleton(element: XMLElement) {
        let href: string | undefined = element.getAttribute('href')?.getValue();
        let skeleton: XliffSkeleton = new XliffSkeleton(href);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffFile) {
            parent.setSkeleton(skeleton);
            this.xliffStack.push(skeleton);
        } else {
            throw new Error('<skeleton> element must be a child of <file>');
        }
    }

    buildData(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        if (id === undefined) {
            throw new Error('Missing required "id" attribute on <data> element');
        }
        let data: XliffData = new XliffData(id);
        let dir: string | undefined = element.getAttribute('dir')?.getValue();
        if (dir !== undefined) {
            if (dir !== 'ltr' && dir !== 'rtl' && dir !== 'auto') {
                throw new Error('Invalid value for "dir" attribute on <data> element: ' + dir);
            }
            data.setDir(dir as XliffDirection);
        }
        let xmlSpace: string | undefined = element.getAttribute('xml:space')?.getValue();
        if (xmlSpace !== undefined) {
            if (xmlSpace !== 'preserve') {
                throw new Error('Invalid value for "xml:space" attribute on <data> element: ' + xmlSpace);
            }
            data.setXmlSpace(xmlSpace as XliffDataXmlSpace);
        }
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffOriginalData) {
            parent.addData(data);
            this.xliffStack.push(data);
        } else {
            throw new Error('<data> element must be a child of <originalData>');
        }
    }

    buildOriginalData(element: XMLElement) {
        let originalData: XliffOriginalData = new XliffOriginalData();
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffUnit || parent instanceof XliffMatch) {
            parent.setOriginalData(originalData);
            this.xliffStack.push(originalData);
        } else {
            throw new Error('<originalData> element must be a child of <unit> or <match>');
        }
    }

    buildMeta(element: XMLElement) {
        let type: string | undefined = element.getAttribute('type')?.getValue();
        if (type === undefined) {
            throw new Error('Missing required "type" attribute on <meta> element');
        }
        let meta: XliffMeta = new XliffMeta(type);
        meta.setNamespacePrefix(element.getNamespace());
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffMetaGroup) {
            parent.addMeta(meta);
            this.xliffStack.push(meta);
        } else {
            throw new Error('<meta> element must be a child of <metaGroup>');
        }
    }

    buildMetaGroup(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        let category: string | undefined = element.getAttribute('category')?.getValue();
        let metaGroup: XliffMetaGroup = new XliffMetaGroup(id, category);
        metaGroup.setNamespacePrefix(element.getNamespace());
        let appliesTo: string | undefined = element.getAttribute('appliesTo')?.getValue();
        if (appliesTo !== undefined) {
            if (appliesTo !== 'source' && appliesTo !== 'target' && appliesTo !== 'ignorable') {
                throw new Error('Invalid value for "appliesTo" attribute on <metaGroup> element: ' + appliesTo);
            }
            metaGroup.setAppliesTo(appliesTo as XliffMetaGroupAppliesTo);
        }
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffMetadata || parent instanceof XliffMetaGroup) {
            parent.addMetaGroup(metaGroup);
            this.xliffStack.push(metaGroup);
        } else {
            throw new Error('<metaGroup> element must be a child of <metadata> or <metaGroup>');
        }
    }

    buildMetadata(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        let metadata: XliffMetadata = new XliffMetadata(id);
        metadata.setNamespacePrefix(element.getNamespace());
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffDocument || parent instanceof XliffFile || parent instanceof XliffGroup
            || parent instanceof XliffUnit || parent instanceof XliffMatch || parent instanceof XliffGlossEntry) {
            parent.setMetadata(metadata);
            this.xliffStack.push(metadata);
        } else {
            throw new Error('<metadata> element must be a child of <xliff>, <file>, <group>, <unit>, <match>, or <glossEntry>');
        }
    }

    buildGlossary(element: XMLElement) {
        let glossary: XliffGlossary = new XliffGlossary();
        glossary.setNamespacePrefix(element.getNamespace());
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffUnit) {
            parent.setGlossary(glossary);
            this.xliffStack.push(glossary);
        } else {
            throw new Error('<glossary> element must be a child of <unit>');
        }
    }

    buildGlossEntry(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        let ref: string | undefined = element.getAttribute('ref')?.getValue();
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['id', 'ref']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        let glossEntry: XliffGlossEntry = new XliffGlossEntry(new XliffTerm());
        glossEntry.setNamespacePrefix(element.getNamespace());
        if (id !== undefined) {
            glossEntry.setId(id);
        }
        if (ref !== undefined) {
            glossEntry.setRef(ref);
        }
        glossEntry.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffGlossary) {
            parent.addGlossEntry(glossEntry);
            this.xliffStack.push(glossEntry);
        } else {
            throw new Error('<glossEntry> element must be a child of <glossary>');
        }
    }

    buildTerm(element: XMLElement) {
        let source: string | undefined = element.getAttribute('source')?.getValue();
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['source']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        let term: XliffTerm = new XliffTerm();
        term.setNamespacePrefix(element.getNamespace());
        if (source !== undefined) {
            term.setSource(source);
        }
        term.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffGlossEntry) {
            parent.setTerm(term);
            this.xliffStack.push(term);
        } else {
            throw new Error('<term> element must be a child of <glossEntry>');
        }
    }

    buildTranslation(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        let ref: string | undefined = element.getAttribute('ref')?.getValue();
        let source: string | undefined = element.getAttribute('source')?.getValue();
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['id', 'ref', 'source']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        let translation: XliffTranslation = new XliffTranslation();
        translation.setNamespacePrefix(element.getNamespace());
        if (id !== undefined) {
            translation.setId(id);
        }
        if (ref !== undefined) {
            translation.setRef(ref);
        }
        if (source !== undefined) {
            translation.setSource(source);
        }
        translation.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffGlossEntry) {
            parent.addTranslation(translation);
            this.xliffStack.push(translation);
        } else {
            throw new Error('<translation> element must be a child of <glossEntry>');
        }
    }

    buildDefinition(element: XMLElement) {
        let source: string | undefined = element.getAttribute('source')?.getValue();
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['source']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        let definition: XliffDefinition = new XliffDefinition();
        definition.setNamespacePrefix(element.getNamespace());
        if (source !== undefined) {
            definition.setSource(source);
        }
        definition.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffGlossEntry) {
            parent.setDefinition(definition);
            this.xliffStack.push(definition);
        } else {
            throw new Error('<definition> element must be a child of <glossEntry>');
        }
    }

    buildCp(element: XMLElement) {
        let hex: string = element.getAttribute('hex')?.getValue() ?? '';
        let cp: XliffCp = new XliffCp(hex);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffData || parent instanceof XliffSource || parent instanceof XliffTarget || parent instanceof XliffPc || parent instanceof XliffMrk) {
            parent.addCp(cp);
        } else {
            throw new Error('<cp> element has invalid parent element');
        }
        this.xliffStack.push(cp);
    }

    buildPh(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        if (id === undefined) {
            throw new Error('Missing required "id" attribute on <ph> element');
        }
        let ph: XliffPh = new XliffPh(id);
        let canCopy: string | undefined = element.getAttribute('canCopy')?.getValue();
        if (canCopy !== undefined) {
            if (canCopy !== 'yes' && canCopy !== 'no') {
                throw new Error('Invalid value for "canCopy" attribute on <ph> element: ' + canCopy);
            }
            ph.setCanCopy(canCopy as XliffYesNo);
        }
        let canDelete: string | undefined = element.getAttribute('canDelete')?.getValue();
        if (canDelete !== undefined) {
            if (canDelete !== 'yes' && canDelete !== 'no') {
                throw new Error('Invalid value for "canDelete" attribute on <ph> element: ' + canDelete);
            }
            ph.setCanDelete(canDelete as XliffYesNo);
        }
        let canReorder: string | undefined = element.getAttribute('canReorder')?.getValue();
        if (canReorder !== undefined) {
            if (canReorder !== 'yes' && canReorder !== 'no' && canReorder !== 'firstNo') {
                throw new Error('Invalid value for "canReorder" attribute on <ph> element: ' + canReorder);
            }
            ph.setCanReorder(canReorder as XliffCanReorder);
        }
        let copyOf: string | undefined = element.getAttribute('copyOf')?.getValue();
        if (copyOf !== undefined) {
            ph.setCopyOf(copyOf);
        }
        let disp: string | undefined = element.getAttribute('disp')?.getValue();
        if (disp !== undefined) {
            ph.setDisp(disp);
        }
        let equiv: string | undefined = element.getAttribute('equiv')?.getValue();
        if (equiv !== undefined) {
            ph.setEquiv(equiv);
        }
        let dataRef: string | undefined = element.getAttribute('dataRef')?.getValue();
        if (dataRef !== undefined) {
            ph.setDataRef(dataRef);
        }
        let subFlows: string | undefined = element.getAttribute('subFlows')?.getValue();
        if (subFlows !== undefined) {
            ph.setSubFlows(subFlows);
        }
        let subType: string | undefined = element.getAttribute('subType')?.getValue();
        if (subType !== undefined) {
            ph.setSubType(subType as XliffInlineSubType);
        }
        let type: string | undefined = element.getAttribute('type')?.getValue();
        if (type !== undefined) {
            if (type !== 'fmt' && type !== 'ui' && type !== 'quote' && type !== 'link' && type !== 'image'
                && type !== 'other') {
                throw new Error('Invalid value for "type" attribute on <ph> element: ' + type);
            }
            ph.setType(type as XliffInlineType);
        }
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['id', 'canCopy', 'canDelete', 'canReorder', 'copyOf', 'disp',
            'equiv', 'dataRef', 'subFlows', 'subType', 'type']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        ph.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffSource || parent instanceof XliffTarget || parent instanceof XliffPc
            || parent instanceof XliffMrk) {
            parent.addPh(ph);
        } else {
            throw new Error('<ph> element has invalid parent element');
        }
        this.xliffStack.push(ph);
    }

    buildPc(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        if (id === undefined) {
            throw new Error('Missing required "id" attribute on <pc> element');
        }
        let pc: XliffPc = new XliffPc(id);
        let canCopy: string | undefined = element.getAttribute('canCopy')?.getValue();
        if (canCopy !== undefined) {
            if (canCopy !== 'yes' && canCopy !== 'no') {
                throw new Error('Invalid value for "canCopy" attribute on <pc> element: ' + canCopy);
            }
            pc.setCanCopy(canCopy as XliffYesNo);
        }
        let canDelete: string | undefined = element.getAttribute('canDelete')?.getValue();
        if (canDelete !== undefined) {
            if (canDelete !== 'yes' && canDelete !== 'no') {
                throw new Error('Invalid value for "canDelete" attribute on <pc> element: ' + canDelete);
            }
            pc.setCanDelete(canDelete as XliffYesNo);
        }
        let canOverlap: string | undefined = element.getAttribute('canOverlap')?.getValue();
        if (canOverlap !== undefined) {
            if (canOverlap !== 'yes' && canOverlap !== 'no') {
                throw new Error('Invalid value for "canOverlap" attribute on <pc> element: ' + canOverlap);
            }
            pc.setCanOverlap(canOverlap as XliffYesNo);
        }
        let canReorder: string | undefined = element.getAttribute('canReorder')?.getValue();
        if (canReorder !== undefined) {
            if (canReorder !== 'yes' && canReorder !== 'no' && canReorder !== 'firstNo') {
                throw new Error('Invalid value for "canReorder" attribute on <pc> element: ' + canReorder);
            }
            pc.setCanReorder(canReorder as XliffCanReorder);
        }
        let copyOf: string | undefined = element.getAttribute('copyOf')?.getValue();
        if (copyOf !== undefined) {
            pc.setCopyOf(copyOf);
        }
        let dispEnd: string | undefined = element.getAttribute('dispEnd')?.getValue();
        if (dispEnd !== undefined) {
            pc.setDispEnd(dispEnd);
        }
        let dispStart: string | undefined = element.getAttribute('dispStart')?.getValue();
        if (dispStart !== undefined) {
            pc.setDispStart(dispStart);
        }
        let equivEnd: string | undefined = element.getAttribute('equivEnd')?.getValue();
        if (equivEnd !== undefined) {
            pc.setEquivEnd(equivEnd);
        }
        let equivStart: string | undefined = element.getAttribute('equivStart')?.getValue();
        if (equivStart !== undefined) {
            pc.setEquivStart(equivStart);
        }
        let dataRefEnd: string | undefined = element.getAttribute('dataRefEnd')?.getValue();
        if (dataRefEnd !== undefined) {
            pc.setDataRefEnd(dataRefEnd);
        }
        let dataRefStart: string | undefined = element.getAttribute('dataRefStart')?.getValue();
        if (dataRefStart !== undefined) {
            pc.setDataRefStart(dataRefStart);
        }
        let subFlowsEnd: string | undefined = element.getAttribute('subFlowsEnd')?.getValue();
        if (subFlowsEnd !== undefined) {
            pc.setSubFlowsEnd(subFlowsEnd);
        }
        let subFlowsStart: string | undefined = element.getAttribute('subFlowsStart')?.getValue();
        if (subFlowsStart !== undefined) {
            pc.setSubFlowsStart(subFlowsStart);
        }
        let subType: string | undefined = element.getAttribute('subType')?.getValue();
        if (subType !== undefined) {
            pc.setSubType(subType as XliffInlineSubType);
        }
        let type: string | undefined = element.getAttribute('type')?.getValue();
        if (type !== undefined) {
            if (type !== 'fmt' && type !== 'ui' && type !== 'quote' && type !== 'link' && type !== 'image' && type !== 'other') {
                throw new Error('Invalid value for "type" attribute on <pc> element: ' + type);
            }
            pc.setType(type as XliffInlineType);
        }
        let dir: string | undefined = element.getAttribute('dir')?.getValue();
        if (dir !== undefined) {
            if (dir !== 'ltr' && dir !== 'rtl' && dir !== 'auto') {
                throw new Error('Invalid value for "dir" attribute on <pc> element: ' + dir);
            }
            pc.setDir(dir as XliffDirection);
        }
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['id', 'canCopy', 'canDelete', 'canOverlap', 'canReorder', 'copyOf',
            'dispEnd', 'dispStart', 'equivEnd', 'equivStart', 'dataRefEnd', 'dataRefStart', 'subFlowsEnd',
            'subFlowsStart', 'subType', 'type', 'dir']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        pc.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffSource || parent instanceof XliffTarget || parent instanceof XliffPc ||
            parent instanceof XliffMrk) {
            parent.addPc(pc);
        } else {
            throw new Error('<pc> element has invalid parent element');
        }
        this.xliffStack.push(pc);
    }

    buildSc(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        if (id === undefined) {
            throw new Error('Missing required "id" attribute on <sc> element');
        }
        let sc: XliffSc = new XliffSc(id);
        let canCopy: string | undefined = element.getAttribute('canCopy')?.getValue();
        if (canCopy !== undefined) {
            if (canCopy !== 'yes' && canCopy !== 'no') {
                throw new Error('Invalid value for "canCopy" attribute on <sc> element: ' + canCopy);
            }
            sc.setCanCopy(canCopy as XliffYesNo);
        }
        let canDelete: string | undefined = element.getAttribute('canDelete')?.getValue();
        if (canDelete !== undefined) {
            if (canDelete !== 'yes' && canDelete !== 'no') {
                throw new Error('Invalid value for "canDelete" attribute on <sc> element: ' + canDelete);
            }
            sc.setCanDelete(canDelete as XliffYesNo);
        }
        let canOverlap: string | undefined = element.getAttribute('canOverlap')?.getValue();
        if (canOverlap !== undefined) {
            if (canOverlap !== 'yes' && canOverlap !== 'no') {
                throw new Error('Invalid value for "canOverlap" attribute on <sc> element: ' + canOverlap);
            }
            sc.setCanOverlap(canOverlap as XliffYesNo);
        }
        let canReorder: string | undefined = element.getAttribute('canReorder')?.getValue();
        if (canReorder !== undefined) {
            if (canReorder !== 'yes' && canReorder !== 'no' && canReorder !== 'firstNo') {
                throw new Error('Invalid value for "canReorder" attribute on <sc> element: ' + canReorder);
            }
            sc.setCanReorder(canReorder as XliffCanReorder);
        }
        let copyOf: string | undefined = element.getAttribute('copyOf')?.getValue();
        if (copyOf !== undefined) {
            sc.setCopyOf(copyOf);
        }
        let dataRef: string | undefined = element.getAttribute('dataRef')?.getValue();
        if (dataRef !== undefined) {
            sc.setDataRef(dataRef);
        }
        let dir: string | undefined = element.getAttribute('dir')?.getValue();
        if (dir !== undefined) {
            if (dir !== 'ltr' && dir !== 'rtl' && dir !== 'auto') {
                throw new Error('Invalid value for "dir" attribute on <sc> element: ' + dir);
            }
            sc.setDir(dir as XliffDirection);
        }
        let disp: string | undefined = element.getAttribute('disp')?.getValue();
        if (disp !== undefined) {
            sc.setDisp(disp);
        }
        let equiv: string | undefined = element.getAttribute('equiv')?.getValue();
        if (equiv !== undefined) {
            sc.setEquiv(equiv);
        }
        let isolated: string | undefined = element.getAttribute('isolated')?.getValue();
        if (isolated !== undefined) {
            if (isolated !== 'yes' && isolated !== 'no') {
                throw new Error('Invalid value for "isolated" attribute on <sc> element: ' + isolated);
            }
            sc.setIsolated(isolated as XliffYesNo);
        }
        let subFlows: string | undefined = element.getAttribute('subFlows')?.getValue();
        if (subFlows !== undefined) {
            sc.setSubFlows(subFlows);
        }
        let subType: string | undefined = element.getAttribute('subType')?.getValue();
        if (subType !== undefined) {
            sc.setSubType(subType as XliffInlineSubType);
        }
        let type: string | undefined = element.getAttribute('type')?.getValue();
        if (type !== undefined) {
            if (type !== 'fmt' && type !== 'ui' && type !== 'quote' && type !== 'link' && type !== 'image' && type !== 'other') {
                throw new Error('Invalid value for "type" attribute on <sc> element: ' + type);
            }
            sc.setType(type as XliffInlineType);
        }
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['id', 'canCopy', 'canDelete', 'canOverlap', 'canReorder', 'copyOf',
            'dataRef', 'dir', 'disp', 'equiv', 'isolated', 'subFlows', 'subType', 'type']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        sc.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffSource || parent instanceof XliffTarget || parent instanceof XliffPc ||
            parent instanceof XliffMrk) {
            parent.addSc(sc);
        } else {
            throw new Error('<sc> element has invalid parent element');
        }
        this.xliffStack.push(sc);
    }

    buildEc(element: XMLElement) {
        let startRef: string | undefined = element.getAttribute('startRef')?.getValue();
        let ec: XliffEc = new XliffEc(startRef);
        let id: string | undefined = element.getAttribute('id')?.getValue();
        if (id !== undefined) {
            ec.setId(id);
        }
        let canCopy: string | undefined = element.getAttribute('canCopy')?.getValue();
        if (canCopy !== undefined) {
            if (canCopy !== 'yes' && canCopy !== 'no') {
                throw new Error('Invalid value for "canCopy" attribute on <ec> element: ' + canCopy);
            }
            ec.setCanCopy(canCopy as XliffYesNo);
        }
        let canDelete: string | undefined = element.getAttribute('canDelete')?.getValue();
        if (canDelete !== undefined) {
            if (canDelete !== 'yes' && canDelete !== 'no') {
                throw new Error('Invalid value for "canDelete" attribute on <ec> element: ' + canDelete);
            }
            ec.setCanDelete(canDelete as XliffYesNo);
        }
        let canOverlap: string | undefined = element.getAttribute('canOverlap')?.getValue();
        if (canOverlap !== undefined) {
            if (canOverlap !== 'yes' && canOverlap !== 'no') {
                throw new Error('Invalid value for "canOverlap" attribute on <ec> element: ' + canOverlap);
            }
            ec.setCanOverlap(canOverlap as XliffYesNo);
        }
        let canReorder: string | undefined = element.getAttribute('canReorder')?.getValue();
        if (canReorder !== undefined) {
            if (canReorder !== 'yes' && canReorder !== 'no' && canReorder !== 'firstNo') {
                throw new Error('Invalid value for "canReorder" attribute on <ec> element: ' + canReorder);
            }
            ec.setCanReorder(canReorder as XliffCanReorder);
        }
        let copyOf: string | undefined = element.getAttribute('copyOf')?.getValue();
        if (copyOf !== undefined) {
            ec.setCopyOf(copyOf);
        }
        let dataRef: string | undefined = element.getAttribute('dataRef')?.getValue();
        if (dataRef !== undefined) {
            ec.setDataRef(dataRef);
        }
        let dir: string | undefined = element.getAttribute('dir')?.getValue();
        if (dir !== undefined) {
            if (dir !== 'ltr' && dir !== 'rtl' && dir !== 'auto') {
                throw new Error('Invalid value for "dir" attribute on <ec> element: ' + dir);
            }
            ec.setDir(dir as XliffDirection);
        }
        let disp: string | undefined = element.getAttribute('disp')?.getValue();
        if (disp !== undefined) {
            ec.setDisp(disp);
        }
        let equiv: string | undefined = element.getAttribute('equiv')?.getValue();
        if (equiv !== undefined) {
            ec.setEquiv(equiv);
        }
        let isolated: string | undefined = element.getAttribute('isolated')?.getValue();
        if (isolated !== undefined) {
            if (isolated !== 'yes' && isolated !== 'no') {
                throw new Error('Invalid value for "isolated" attribute on <ec> element: ' + isolated);
            }
            ec.setIsolated(isolated as XliffYesNo);
        }
        let subFlows: string | undefined = element.getAttribute('subFlows')?.getValue();
        if (subFlows !== undefined) {
            ec.setSubFlows(subFlows);
        }
        let subType: string | undefined = element.getAttribute('subType')?.getValue();
        if (subType !== undefined) {
            ec.setSubType(subType as XliffInlineSubType);
        }
        let type: string | undefined = element.getAttribute('type')?.getValue();
        if (type !== undefined) {
            if (type !== 'fmt' && type !== 'ui' && type !== 'quote' && type !== 'link' && type !== 'image' && type !== 'other') {
                throw new Error('Invalid value for "type" attribute on <ec> element: ' + type);
            }
            ec.setType(type as XliffInlineType);
        }
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['startRef', 'id', 'canCopy', 'canDelete', 'canOverlap', 'canReorder',
            'copyOf', 'dataRef', 'dir', 'disp', 'equiv', 'isolated', 'subFlows', 'subType', 'type']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        ec.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffSource || parent instanceof XliffTarget || parent instanceof XliffPc
            || parent instanceof XliffMrk) {
            parent.addEc(ec);
        } else {
            throw new Error('<ec> element has invalid parent element');
        }
        this.xliffStack.push(ec);
    }

    buildMrk(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        if (id === undefined) {
            throw new Error('Missing required "id" attribute on <mrk> element');
        }
        let mrk: XliffMrk = new XliffMrk(id);
        let translate: string | undefined = element.getAttribute('translate')?.getValue();
        if (translate !== undefined) {
            if (translate !== 'yes' && translate !== 'no') {
                throw new Error('Invalid value for "translate" attribute on <mrk> element: ' + translate);
            }
            mrk.setTranslate(translate as XliffYesNo);
        }
        let type: string | undefined = element.getAttribute('type')?.getValue();
        if (type !== undefined) {
            mrk.setType(type as XliffAnnotationType);
        }
        let ref: string | undefined = element.getAttribute('ref')?.getValue();
        if (ref !== undefined) {
            mrk.setRef(ref);
        }
        let value: string | undefined = element.getAttribute('value')?.getValue();
        if (value !== undefined) {
            mrk.setValue(value);
        }
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['id', 'translate', 'type', 'ref', 'value']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        mrk.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffSource || parent instanceof XliffTarget || parent instanceof XliffPc ||
            parent instanceof XliffMrk) {
            parent.addMrk(mrk);
        } else {
            throw new Error('<mrk> element has invalid parent element');
        }
        this.xliffStack.push(mrk);
    }

    buildSm(element: XMLElement) {
        let id: string | undefined = element.getAttribute('id')?.getValue();
        if (id === undefined) {
            throw new Error('Missing required "id" attribute on <sm> element');
        }
        let sm: XliffSm = new XliffSm(id);
        let translate: string | undefined = element.getAttribute('translate')?.getValue();
        if (translate !== undefined) {
            if (translate !== 'yes' && translate !== 'no') {
                throw new Error('Invalid value for "translate" attribute on <sm> element: ' + translate);
            }
            sm.setTranslate(translate as XliffYesNo);
        }
        let type: string | undefined = element.getAttribute('type')?.getValue();
        if (type !== undefined) {
            sm.setType(type as XliffAnnotationType);
        }
        let ref: string | undefined = element.getAttribute('ref')?.getValue();
        if (ref !== undefined) {
            sm.setRef(ref);
        }
        let value: string | undefined = element.getAttribute('value')?.getValue();
        if (value !== undefined) {
            sm.setValue(value);
        }
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['id', 'translate', 'type', 'ref', 'value']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        sm.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffSource || parent instanceof XliffTarget || parent instanceof XliffPc || parent instanceof XliffMrk) {
            parent.addSm(sm);
        } else {
            throw new Error('<sm> element has invalid parent element');
        }
        this.xliffStack.push(sm);
    }

    buildEm(element: XMLElement) {
        let startRef: string | undefined = element.getAttribute('startRef')?.getValue();
        if (startRef === undefined) {
            throw new Error('Missing required "startRef" attribute on <em> element');
        }
        let em: XliffEm = new XliffEm(startRef);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffSource || parent instanceof XliffTarget || parent instanceof XliffPc ||
            parent instanceof XliffMrk) {
            parent.addEm(em);
        } else {
            throw new Error('<em> element has invalid parent element');
        }
        this.xliffStack.push(em);
    }

    buildMatches(element: XMLElement) {
        let matches: XliffMatches = new XliffMatches();
        matches.setNamespacePrefix(element.getNamespace());
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffUnit) {
            parent.setMatches(matches);
            this.xliffStack.push(matches);
        } else {
            throw new Error('<matches> element must be a child of <unit>');
        }
    }

    buildMatch(element: XMLElement) {
        let ref: string | undefined = element.getAttribute('ref')?.getValue();
        if (ref === undefined) {
            throw new Error('Missing required "ref" attribute on <match> element');
        }
        let match: XliffMatch = new XliffMatch(ref);
        match.setNamespacePrefix(element.getNamespace());
        let id: string | undefined = element.getAttribute('id')?.getValue();
        if (id !== undefined) {
            match.setId(id);
        }
        let matchQuality: string | undefined = element.getAttribute('matchQuality')?.getValue();
        if (matchQuality !== undefined) {
            match.setMatchQuality(matchQuality);
        }
        let matchSuitability: string | undefined = element.getAttribute('matchSuitability')?.getValue();
        if (matchSuitability !== undefined) {
            match.setMatchSuitability(matchSuitability);
        }
        let origin: string | undefined = element.getAttribute('origin')?.getValue();
        if (origin !== undefined) {
            match.setOrigin(origin);
        }
        let reference: string | undefined = element.getAttribute('reference')?.getValue();
        if (reference !== undefined) {
            if (reference !== 'yes' && reference !== 'no') {
                throw new Error('Invalid value for "reference" attribute on <match> element: ' + reference);
            }
            match.setReference(reference as XliffYesNo);
        }
        let similarity: string | undefined = element.getAttribute('similarity')?.getValue();
        if (similarity !== undefined) {
            match.setSimilarity(similarity);
        }
        let subType: string | undefined = element.getAttribute('subType')?.getValue();
        if (subType !== undefined) {
            match.setSubType(subType);
        }
        let type: string | undefined = element.getAttribute('type')?.getValue();
        if (type !== undefined) {
            if (type !== 'am' && type !== 'mt' && type !== 'icm' && type !== 'idm' &&
                type !== 'tb' && type !== 'tm' && type !== 'other') {
                throw new Error('Invalid value for "type" attribute on <match> element: ' + type);
            }
            match.setType(type as XliffMatchType);
        }
        let atts: Array<XMLAttribute> = element.getAttributes();
        const xliffAtts: Set<string> = new Set<string>(['ref', 'id', 'matchQuality', 'matchSuitability', 'origin',
            'reference', 'similarity', 'subType', 'type']);
        let otherAtts: Array<XMLAttribute> = atts.filter(att => !xliffAtts.has(att.getName()));
        match.setOtherAttributes(otherAtts);
        let parent = this.xliffStack[this.xliffStack.length - 1];
        if (parent instanceof XliffMatches) {
            parent.addMatch(match);
            this.xliffStack.push(match);
        } else {
            throw new Error('<match> element must be a child of <matches>');
        }
    }

    getCurrentText(): string {
        if (this.stack.length > 0) {
            return this.stack[this.stack.length - 1].pureText();
        }
        return '';
    }


}