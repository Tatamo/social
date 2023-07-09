import {test} from "tap"
import {
    createSignature, createSigningString,
    crypto,
    digest,
    generateUserKeyPair,
    signatureHeaderToMap,
} from "../../src/domain/sign";

test("signature", async (t) => {
    // create test key pair
    const {privateKey, publicKey} = await generateUserKeyPair();

    const body = JSON.stringify({
        key: "value"
    });

    const method = "POST";
    const url = "example.com/";
    const headers = {
        Host: "social.tatamo.dev",
        Date: new Date().toUTCString(),
        Digest: await digest(body)
    };
    const signingString = createSigningString(method, url, headers);
    const signatureHeader = await createSignature(method, url, headers, "https://social.tatamo.dev/users/tatamo#main-key", privateKey);
    const signature = signatureHeaderToMap(signatureHeader).get("signature")!;
    t.same(signature, Buffer.from(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, new TextEncoder().encode(signingString))).toString("base64"));
})
