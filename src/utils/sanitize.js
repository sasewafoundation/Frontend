import DOMPurify from 'dompurify';

/**
 * FIX 2: Sanitize raw HTML using DOMPurify to prevent stored and reflected XSS.
 * Permits safe semantic typography while completely stripping scripts, frames,
 * event handlers (e.g. onerror, onload), and embeds.
 */
export const sanitizeHtml = (dirty) => {
  if (!dirty) return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'u', 's', 'p', 'br', 'hr',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'img', 'blockquote', 'code', 'pre', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'class'],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick', 'onmouseover'],
  });
};

export default sanitizeHtml;
