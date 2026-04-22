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

export type XliffVersion = "2.0" | "2.1" | "2.2";
export type XliffYesNo = "yes" | "no";
export type XliffCanReorder = "yes" | "firstNo" | "no";
export type XliffDirection = "ltr" | "rtl" | "auto";
export type XliffXmlSpace = "default" | "preserve";
export type XliffDataXmlSpace = "preserve";
export type XliffSegmentState = "initial" | "translated" | "reviewed" | "final";
export type XliffNoteAppliesTo = "source" | "target";
export type XliffMetaGroupAppliesTo = "source" | "target" | "ignorable";
export type XliffMatchType = "am" | "mt" | "icm" | "idm" | "tb" | "tm" | "other";
export type XliffNotePriority = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type XliffInlineType = "fmt" | "ui" | "quote" | "link" | "image" | "other";
export type XliffInlineSubType = "xlf:lb" | "xlf:pb" | "xlf:b" | "xlf:i" | "xlf:u" | "xlf:var" | (string & {});
export type XliffAnnotationType = "generic" | "comment" | "term" | (string & {});