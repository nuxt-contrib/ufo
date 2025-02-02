import { toASCII } from "./punycode";
import { QueryValue } from "./query";

// Utils used from https://github.com/vuejs/vue-router-next/blob/master/src/encoding.ts (Author @posva)

const HASH_RE = /#/g; // %23
const AMPERSAND_RE = /&/g; // %26
const SLASH_RE = /\//g; // %2F
const EQUAL_RE = /=/g; // %3D
const IM_RE = /\?/g; // %3F
const PLUS_RE = /\+/g; // %2B

const ENC_CARET_RE = /%5e/gi; // ^
const ENC_BACKTICK_RE = /%60/gi; // `
const ENC_CURLY_OPEN_RE = /%7b/gi; // {
const ENC_PIPE_RE = /%7c/gi; // |
const ENC_CURLY_CLOSE_RE = /%7d/gi; // }
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;

/**
 * Encodes characters that need to be encoded in the path, search and hash
 * sections of the URL.
 *
 * @group encoding_utils
 *
 * @param text - string to encode
 * @returns encoded string
 */
export function encode(text: string | number): string {
  return encodeURI("" + text);
}

/**
 * Encodes characters that need to be encoded in the hash section of the URL.
 *
 * @group encoding_utils
 *
 * @param text - string to encode
 * @returns encoded string
 */
export function encodeHash(text: string): string {
  return encode(text)
    .replace(ENC_CURLY_OPEN_RE, "{")
    .replace(ENC_CURLY_CLOSE_RE, "}")
    .replace(ENC_CARET_RE, "^");
}

/**
 * Encodes characters that need to be encoded for query values in the query
 * section of the URL.
 *
 * @group encoding_utils
 *
 * @param input - string to encode
 * @returns encoded string
 */
export function encodeQueryValue(input: QueryValue): string {
  return (
    encode(typeof input === "string" ? input : JSON.stringify(input))
      // Encodes the space as +, encode the + to differentiate it from the space
      .replace(PLUS_RE, "%2B")
      .replace(ENC_SPACE_RE, "+")
      .replace(HASH_RE, "%23")
      .replace(AMPERSAND_RE, "%26")
      .replace(ENC_BACKTICK_RE, "`")
      .replace(ENC_CARET_RE, "^")
      .replace(SLASH_RE, "%2F")
  );
}

/**
 * Encodes characters that need to be encoded for query values in the query
 * section of the URL and also encodes the `=` character.
 *
 * @group encoding_utils
 *
 * @param text - string to encode
 */
export function encodeQueryKey(text: string | number): string {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}

/**
 * Encodes characters that need to be encoded in the path section of the URL.
 *
 * @group encoding_utils
 *
 * @param text - string to encode
 * @returns encoded string
 */
export function encodePath(text: string | number): string {
  return encode(text)
    .replace(HASH_RE, "%23")
    .replace(IM_RE, "%3F")
    .replace(ENC_ENC_SLASH_RE, "%2F")
    .replace(AMPERSAND_RE, "%26")
    .replace(PLUS_RE, "%2B");
}

/**
 * Encodes characters that need to be encoded in the path section of the URL as a
 * param. This function encodes everything `encodePath` does plus the
 * slash (`/`) character.
 *
 * @group encoding_utils
 *
 * @param text - string to encode
 * @returns encoded string
 */
export function encodeParam(text: string | number): string {
  return encodePath(text).replace(SLASH_RE, "%2F");
}

/**
 * Decodes text using `decodeURIComponent`. Returns the original text if it
 * fails.
 *
 * @group encoding_utils
 *
 * @param text - string to decode
 * @returns decoded string
 */
export function decode(text: string | number = ""): string {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}

/**
 * Decodes path section of URL (consistent with encodePath for slash encoding).
 *
 * @group encoding_utils
 *
 * @param text - string to decode
 * @returns decoded string
 */
export function decodePath(text: string): string {
  return decode(text.replace(ENC_SLASH_RE, "%252F"));
}

/**
 * Decodes query key (consistent with `encodeQueryKey` for plus encoding).
 *
 * @group encoding_utils
 *
 * @param text - string to decode
 * @returns decoded string
 */
export function decodeQueryKey(text: string): string {
  return decode(text.replace(PLUS_RE, " "));
}

/**
 * Decodes query value (consistent with `encodeQueryValue` for plus encoding).
 *
 * @group encoding_utils
 *
 * @param text - string to decode
 * @returns decoded string
 */
export function decodeQueryValue(text: string): string {
  return decode(text.replace(PLUS_RE, " "));
}

/**
 * Encodes hostname with punycode encoding.
 *
 * @group encoding_utils
 */
export function encodeHost(name = "") {
  return toASCII(name);
}
