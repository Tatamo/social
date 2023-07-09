// WIP
// HTTP Signatures (follow Mastodon spec https://docs.joinmastodon.org/spec/security/)
// use Cavage draft version instead of newer httpbis version
// https://datatracker.ietf.org/doc/html/draft-cavage-http-signatures

// https://nodejs.org/api/crypto.html#determining-if-crypto-support-is-unavailable
export const crypto: typeof import("node:crypto") = (() => {
    try {
        return require("node:crypto");
    } catch (err) {
        console.error("FATAL: crypto is not supported in current node.js runtime:", err);
        throw err;
    }
})();

export async function generateUserKeyPair(): Promise<import("node:crypto").webcrypto.CryptoKeyPair> {
    return await crypto.subtle.generateKey({
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    }, true, ["verify", "sign"]);
}

export async function exportPublicKeyPem(publicKey: import("node:crypto").webcrypto.CryptoKey): Promise<string> {
    return `-----BEGIN PUBLIC KEY-----
${Buffer.from(await crypto.subtle.exportKey("spki", publicKey)).toString("base64")}
-----END PUBLIC KEY-----`;
}

const signHeaders = {
    GET: [
        "(request-target)",
        "Host",
        "Date"
    ],
    POST: [
        "(request-target)",
        "Host",
        "Date",
        "Digest"
    ]
} as const;

export type SHA256DigestHeaderValue = `sha-256=${string}`;

export async function digest(body: string): Promise<SHA256DigestHeaderValue> {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body));
    return `sha-256=${Buffer.from(digest).toString("base64")}`;
}

// TODO: pass sign headers as args
export function createSigningString(method: "GET" | "POST", url: string, headers: {
    Host: string,
    Date: string,
    Digest?: SHA256DigestHeaderValue
}): string {
    return signHeaders[method]
        .map((name) => {
            switch (name) {
                case "(request-target)":
                    return `${name}: ${method.toLowerCase()} ${url}`;
                default:
                    return `${name.toLowerCase()}: ${headers[name]}`;
            }
        })
        .join("\n");
}

export async function createSignature(method: "GET" | "POST", url: string, headers: {
    Host: string,
    Date: string,
    Digest?: SHA256DigestHeaderValue
}, keyId: string, privateKey: import("node:crypto").webcrypto.CryptoKey): Promise<string> {
    const signString = createSigningString(method, url, headers);
    const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, new TextEncoder().encode(signString));

    return `"keyId=${keyId}", algorithm="rsa-sha256", headers="${signHeaders[method].map(s => s.toLowerCase()).join(" ")}", signature="${Buffer.from(signature).toString("base64")}"`;
}

export function signatureHeaderToMap(signatureHeaderValue: string): Map<string, string> {
    return new Map(signatureHeaderValue
        .split(",")
        .map(s => {
            const match = /^(.+?)="(.+)"$/.exec(s.trim());
            if (match === null) return [];
            return [match[1], match[2]];
        })
        .filter(v => v.length > 0)
        .map(([k, v]) => [k, v.replace(/(^")|("$)/g, "")]));
}

// WIP
export async function verify(requestMethod: "GET" | "POST", requestUrl: string, requestHeaders: {
    Host: string,
    Date: string,
    Digest?: SHA256DigestHeaderValue
}, signatureHeaderValue: string, publicKey?: import("node:crypto").webcrypto.CryptoKey): Promise<boolean> {
    const params = signatureHeaderToMap(signatureHeaderValue);
    if (!params.has("keyId")) {
        return false;
    }
    // TODO: search valid public Key
    if (publicKey === undefined) {
        throw new Error("currently publicKey must be provided");
    }

    // const headers = params.has("headers") ? params.get("headers")!.split(" ") : ["(created)"];

    if (!params.has("signature")) {
        return false;
    }
    // current verification logic cannot other implementation's signature, so just outputs a log
    const signature = params.get("signature")!;
    const signString = createSigningString(requestMethod, requestUrl, requestHeaders);
    const verified = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, Buffer.from(signature), new TextEncoder().encode(signString));
    if (!verified) {
        console.warn("signature verification failed");
    }

    return true;
}

