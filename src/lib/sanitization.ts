import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes a string to prevent XSS.
 * Strips all HTML tags and attributes.
 */
export function sanitizeText(text: string): string {
    if (!text) return '';
    return DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [], // Strip all tags
        ALLOWED_ATTR: [], // Strip all attributes
    }).trim();
}

/**
 * Sanitizes a URL to ensure it's a valid web link.
 */
export function sanitizeUrl(url: string): string {
    if (!url) return '';
    const clean = url.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
        return clean;
    }
    return '';
}
