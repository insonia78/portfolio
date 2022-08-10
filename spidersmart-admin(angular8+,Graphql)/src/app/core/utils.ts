/**
 * Checks if the given string is a data url
 * @param value The value to check
 *
 * @see https://developer.mozilla.org/en-US/docs/data_URIs
 * @see http://tools.ietf.org/html/rfc2397
 *
 * @return True if a valid data url
 */
export function isDataUrl(value: string) {
    if (value) {
        return !!value.match(/^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i);
    }
    return null;
}
