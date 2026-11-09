/**
 * Strapi utility functions for Stories & Poems
 */

/**
 * Safely retrieves the Strapi Base URL from Vite environment variables.
 */
export const getStrapiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_STRAPI_URL) {
    return import.meta.env.VITE_STRAPI_URL;
  }
  return '';
};

/**
 * Resolves a Strapi media object to a full URL.
 * Handles single media object, array of media objects, or string URL.
 */
export const getStrapiMediaUrl = (media) => {
  if (!media) return '';
  const target = Array.isArray(media) ? media[0] : media;
  const url = target?.url || (typeof target === 'string' ? target : '');
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const baseUrl = getStrapiBaseUrl();
  return `${baseUrl}${url}`;
};

/**
 * Formats a chapter number with a leading zero (e.g., 1 -> "01", 12 -> "12")
 */
export const formatChapterNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '01';
  return String(num).padStart(2, '0');
};

/**
 * Cleans chapter title if it redundantly includes "Chapter X -" or similar prefix
 */
export const cleanChapterTitle = (rawTitle) => {
  if (!rawTitle) return '';
  return rawTitle.replace(/^chapter\s*\d+\s*[-:–—]?\s*/i, '').trim();
};

/**
 * Safely extracts genre display name whether object { Name: '...' } or string
 */
export const getGenreName = (genre) => {
  if (!genre) return '';
  if (typeof genre === 'string') return genre;
  return genre.Name || genre.name || '';
};

/**
 * Sanitizes and formats rich or plain text content for safe HTML rendering.
 * - If formatted HTML is provided: strips dangerous tags/attributes and returns safe HTML.
 * - If plain text with newlines is provided: converts into semantic <p> paragraphs and <br/> breaks.
 */
export const sanitizeAndFormatContent = (content) => {
  if (!content) return '';

  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);

  if (!hasHtmlTags) {
    // Format plain text into clean paragraphs
    return content
      .split(/\r?\n\r?\n+/)
      .map((para) => {
        const trimmed = para.trim();
        if (!trimmed) return '';
        const lines = trimmed
          .split(/\r?\n/)
          .map((line) => line.trim())
          .join('<br />');
        return `<p>${lines}</p>`;
      })
      .filter(Boolean)
      .join('');
  }

  // Content has HTML: sanitize dangerous tags and attributes
  if (typeof window !== 'undefined' && window.DOMParser) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      // Strip dangerous executable elements
      const dangerousTags = [
        'script',
        'style',
        'iframe',
        'object',
        'embed',
        'form',
        'input',
        'button',
        'link',
        'meta',
        'frame',
        'frameset',
      ];
      dangerousTags.forEach((tag) => {
        doc.querySelectorAll(tag).forEach((el) => el.remove());
      });

      // Strip dangerous attributes (inline event handlers, javascript: URIs)
      const allElements = doc.querySelectorAll('*');
      allElements.forEach((el) => {
        Array.from(el.attributes).forEach((attr) => {
          const name = attr.name.toLowerCase();
          const val = attr.value.toLowerCase().trim();
          if (
            name.startsWith('on') ||
            val.startsWith('javascript:') ||
            val.startsWith('data:text/html') ||
            val.startsWith('vbscript:')
          ) {
            el.removeAttribute(attr.name);
          }
        });
      });

      return doc.body.innerHTML;
    } catch {
      // Fallback if parser fails
      return content.replace(/<script[\s\S]*?<\/script>/gi, '');
    }
  }

  return content;
};
