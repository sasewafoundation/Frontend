import { sanitizeHtml } from './sanitize.js';

/**
 * Converts Markdown text into sanitized semantic HTML for public rendering.
 * Supports:
 *  - Headings: # H1, ## H2, ### H3
 *  - Bold: **text** or __text__
 *  - Italic: *text* or _text_
 *  - Unordered / bullet lists: - item or * item
 *  - Ordered / numbered lists: 1. item
 *  - Links: [label](url)
 *  - Paragraph breaks
 * If the input already contains HTML tags, sanitizes and returns it safely.
 */
export function renderMarkdown(input) {
  if (!input) return '';

  const str = String(input).trim();
  if (!str) return '';

  // If already full HTML (e.g. starts with <p, <div, etc.), sanitize directly
  if (/^<[a-z][\s\S]*>/i.test(str) && /<\/[a-z]+>/i.test(str)) {
    return sanitizeHtml(str);
  }

  const lines = str.replace(/\r\n/g, '\n').split('\n');
  const htmlParts = [];
  let inList = null; // 'ul' | 'ol' | null

  const closeList = () => {
    if (inList) {
      htmlParts.push(`</${inList}>`);
      inList = null;
    }
  };

  const inlineFormat = (text) => {
    if (!text) return '';
    return text
      // Bold + Italic (***text***)
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      // Bold (**text** or __text__)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      // Italic (*text* or _text_)
      .replace(/(^|[^\*])\*([^\*\s][^\*]*?)\*([^\*]|$)/g, '$1<em>$2</em>$3')
      .replace(/(^|[^_])_([^_\s][^_]*?)_([^_]|$)/g, '$1<em>$2</em>$3')
      // Inline link [label](url)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline hover:text-primary-700">$1</a>');
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      closeList();
      continue;
    }

    // Headings
    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      closeList();
      htmlParts.push(`<h3 class="text-xl md:text-2xl font-bold text-neutral-900 mt-7 mb-3 tracking-tight">${inlineFormat(h3Match[1])}</h3>`);
      continue;
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      closeList();
      htmlParts.push(`<h2 class="text-2xl md:text-3xl font-extrabold text-neutral-900 mt-9 mb-4 tracking-tight">${inlineFormat(h2Match[1])}</h2>`);
      continue;
    }

    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match) {
      closeList();
      htmlParts.push(`<h1 class="text-3xl md:text-4xl font-extrabold text-neutral-900 mt-10 mb-5 tracking-tight">${inlineFormat(h1Match[1])}</h1>`);
      continue;
    }

    // Bullet list: - item or * item
    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      if (inList !== 'ul') {
        closeList();
        htmlParts.push('<ul class="list-disc pl-6 space-y-2 my-4 text-neutral-700 text-base md:text-lg">');
        inList = 'ul';
      }
      htmlParts.push(`<li class="leading-relaxed">${inlineFormat(ulMatch[1])}</li>`);
      continue;
    }

    // Numbered list: 1. item
    const olMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      if (inList !== 'ol') {
        closeList();
        htmlParts.push('<ol class="list-decimal pl-6 space-y-2 my-4 text-neutral-700 text-base md:text-lg">');
        inList = 'ol';
      }
      htmlParts.push(`<li class="leading-relaxed">${inlineFormat(olMatch[2])}</li>`);
      continue;
    }

    // Regular paragraph
    closeList();
    htmlParts.push(`<p class="mb-5 text-neutral-700 leading-relaxed text-base md:text-lg">${inlineFormat(line)}</p>`);
  }

  closeList();
  return sanitizeHtml(htmlParts.join('\n'));
}

export default renderMarkdown;
