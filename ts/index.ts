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

export { XliffDefinition } from "./models/glossary/XliffDefinition.js";
export { XliffGlossary } from "./models/glossary/XliffGlossary.js";
export { XliffGlossEntry } from "./models/glossary/XliffGlossEntry.js";
export { XliffTerm } from "./models/glossary/XliffTerm.js";
export { XliffTranslation } from "./models/glossary/XliffTranslation.js";
export { XliffCp } from "./models/inline/XliffCp.js";
export { XliffEc } from "./models/inline/XliffEc.js";
export { XliffEm } from "./models/inline/XliffEm.js";
export { XliffMrk } from "./models/inline/XliffMrk.js";
export { XliffPc } from "./models/inline/XliffPc.js";
export { XliffPh } from "./models/inline/XliffPh.js";
export { XliffSc } from "./models/inline/XliffSc.js";
export { XliffSm } from "./models/inline/XliffSm.js";
export { XliffMatch } from "./models/matches/XliffMatch.js";
export { XliffMatches } from "./models/matches/XliffMatches.js";
export { XliffMeta } from "./models/metadata/XliffMeta.js";
export { XliffMetadata } from "./models/metadata/XliffMetadata.js";
export { XliffMetaGroup } from "./models/metadata/XliffMetaGroup.js";
export { XliffData } from "./models/structural/XliffData.js";
export { XliffDocument } from "./models/structural/XliffDocument.js";
export { XliffFile } from "./models/structural/XliffFile.js";
export { XliffGroup } from "./models/structural/XliffGroup.js";
export { XliffIgnorable } from "./models/structural/XliffIgnorable.js";
export { XliffNote } from "./models/structural/XliffNote.js";
export { XliffNotes } from "./models/structural/XliffNotes.js";
export { XliffOriginalData } from "./models/structural/XliffOriginalData.js";
export { XliffSegment } from "./models/structural/XliffSegment.js";
export { XliffSkeleton } from "./models/structural/XliffSkeleton.js";
export { XliffSource } from "./models/structural/XliffSource.js";
export { XliffTarget } from "./models/structural/XliffTarget.js";
export { XliffUnit } from "./models/structural/XliffUnit.js";
export type { XliffElement } from "./models/XliffElement.js";
export type {
    XliffAnnotationType,
    XliffCanReorder,
    XliffDataXmlSpace,
    XliffDirection,
    XliffInlineSubType,
    XliffInlineType,
    XliffMatchType,
    XliffMetaGroupAppliesTo,
    XliffNoteAppliesTo,
    XliffNotePriority,
    XliffSegmentState,
    XliffVersion,
    XliffXmlSpace,
    XliffYesNo
} from "./models/XliffTypes.js";
export { XliffContentHandler } from "./parser/xliffContentHandler.js";
export { XliffParser } from "./parser/xliffParser.js";
export { XliffToJson } from "./parser/XliffToJson.js";
export { JsonToXliff } from "./parser/JsonToXliff.js";

