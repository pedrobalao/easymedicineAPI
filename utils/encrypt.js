const keySize = 256;
const ivSize = 128;
const saltSize = 256;
const iterations = 1000;

export function encrypt(msg, pass) {
    const salt = CryptoJS.lib.WordArray.random(saltSize / 8);
    const key = CryptoJS.PBKDF2(pass, salt, {
        keySize: keySize / 32,
        iterations: iterations
    });
    const iv = CryptoJS.lib.WordArray.random(ivSize / 8);
    const encrypted = CryptoJS.AES.encrypt(msg, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    const encryptedHex = base64ToHex(encrypted.toString());
    return hexToBase64(salt + iv + encryptedHex);
}

export function decrypt(transitmessage, pass) {
    const hexResult = base64ToHex(transitmessage);
    const salt = CryptoJS.enc.Hex.parse(hexResult.substr(0, 64));
    const iv = CryptoJS.enc.Hex.parse(hexResult.substr(64, 32));
    const encrypted = hexToBase64(hexResult.substring(96));
    const key = CryptoJS.PBKDF2(pass, salt, {
        keySize: keySize / 32,
        iterations: iterations
    });
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

export function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null, str
        .replace(/\r|\n/g, "")
        .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
        .replace(/ +$/, "")
        .split(" ")));
}

export function base64ToHex(str) {
    for (let i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
        let tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1)
            tmp = "0" + tmp;
        hex[hex.length] = tmp;
    }
    return hex.join("");
}
