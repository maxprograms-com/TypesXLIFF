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

export class NamespaceUtils {

    isXliffNamespace(namespace: string): boolean {
        return namespace === "urn:oasis:names:tc:xliff:document:2.0"
            || namespace === "urn:oasis:names:tc:xliff:document:2.2";
    }

    isValidNamespace(namespace: string): boolean {
        return this.isValidURI(namespace) || this.isValidURN(namespace);
    }

    isValidURI(uri: string): boolean {
        const pctEncoded = "%[0-9A-Fa-f]{2}";
        const unreserved = "[A-Za-z0-9\\-._~]";
        const subDelims = "[!$&'()*+,;=]";
        const pchar = "(?:" + unreserved + "|" + pctEncoded + "|" + subDelims + "|:|@)";

        const scheme = "[A-Za-z][A-Za-z0-9+\\-.]*";

        const decOctet = "(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])";
        const ipv4Address = decOctet + "\\." + decOctet + "\\." + decOctet + "\\." + decOctet;

        const h16 = "[0-9A-Fa-f]{1,4}";
        const ls32 = "(?:" + h16 + ":" + h16 + "|" + ipv4Address + ")";
        const ipv6Address = "(?:"
            + "(?:" + h16 + ":){6}" + ls32
            + "|::(?:" + h16 + ":){5}" + ls32
            + "|(?:" + h16 + ")?::(?:" + h16 + ":){4}" + ls32
            + "|(?:(?:" + h16 + ":){0,1}" + h16 + ")?::(?:" + h16 + ":){3}" + ls32
            + "|(?:(?:" + h16 + ":){0,2}" + h16 + ")?::(?:" + h16 + ":){2}" + ls32
            + "|(?:(?:" + h16 + ":){0,3}" + h16 + ")?::" + h16 + ":" + ls32
            + "|(?:(?:" + h16 + ":){0,4}" + h16 + ")?::" + ls32
            + "|(?:(?:" + h16 + ":){0,5}" + h16 + ")?::" + h16
            + "|(?:(?:" + h16 + ":){0,6}" + h16 + ")?::"
            + ")";

        const ipvFuture = "v[0-9A-Fa-f]+\\.(?:" + unreserved + "|" + subDelims + "|:)+";
        const ipLiteral = "\\[(?:" + ipv6Address + "|" + ipvFuture + ")\\]";

        const regName = "(?:" + unreserved + "|" + pctEncoded + "|" + subDelims + ")*";
        const host = "(?:" + ipLiteral + "|" + ipv4Address + "|" + regName + ")";
        const userinfo = "(?:" + unreserved + "|" + pctEncoded + "|" + subDelims + "|:)*";
        const port = "[0-9]*";
        const authority = "(?:" + userinfo + "@)?" + host + "(?::" + port + ")?";

        const segment = pchar + "*";
        const segmentNz = pchar + "+";
        const pathAbempty = "(?:/" + segment + ")*";
        const pathAbsolute = "/(?:" + segmentNz + "(?:/" + segment + ")*)?";
        const pathRootless = segmentNz + "(?:/" + segment + ")*";

        const hierPart = "(?:"
            + "//" + authority + pathAbempty
            + "|" + pathAbsolute
            + "|" + pathRootless
            + "|"
            + ")";

        const query = "(?:" + pchar + "|/|\\?)*";
        const fragment = "(?:" + pchar + "|/|\\?)*";

        const uriRegex = "^" + scheme + ":" + hierPart + "(?:\\?" + query + ")?(?:#" + fragment + ")?$";
        return new RegExp(uriRegex).test(uri);
    }

    isValidURN(urn: string): boolean {
        const pctEncoded = "%[0-9A-Fa-f]{2}";
        const unreserved = "[A-Za-z0-9\\-._~]";
        const subDelims = "[!$&'()*+,;=]";
        const pchar = "(?:" + unreserved + "|" + pctEncoded + "|" + subDelims + "|:|@)";
        const nid = "[A-Za-z0-9][A-Za-z0-9\\-]{0,30}[A-Za-z0-9]";
        const nss = pchar + "(?:" + pchar + "|/)*";
        const rComponent = pchar + "(?:" + pchar + "|/|\\?)*";
        const qComponent = pchar + "(?:" + pchar + "|/|\\?)*";
        const fragment = "(?:" + pchar + "|/|\\?)*";
        const assignedName = "[Uu][Rr][Nn]:" + nid + ":" + nss;
        const rqComponents = "(?:\\?\\+" + rComponent + ")?(?:\\?=" + qComponent + ")?";
        const namestring = "^" + assignedName + rqComponents + "(?:#" + fragment + ")?$";
        return new RegExp(namestring).test(urn);
    }
}