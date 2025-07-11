import crypto from 'crypto';
import base64url from 'base64url';

// let codeVerifier: string = '';


export const generateCodeChallenge = () => {
    const codeVerifier = base64url(crypto.randomBytes(32)); // generate random code verifier
    // if (!codeVerifier) {
    //     codeVerifier = base64url(crypto.randomBytes(32)); // generate random code verifier
    // }
    const hash = crypto.createHash('sha256').update(codeVerifier).digest();
    return { codeVerifier, codeChallenge: base64url(hash) };
}
