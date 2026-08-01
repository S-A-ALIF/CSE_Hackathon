import React from 'react';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function isDarkOrGray(colorStr) {
  if (!colorStr) return false;
  const str = String(colorStr).trim().toLowerCase();
  if (['black', '#000', '#000000', '#111', '#222', '#333', '#444', '#555', '#666', '#777', '#202124', '#3c4043', '#212529', '#1a1a1a', 'windowtext', 'inherit', 'initial'].includes(str)) {
    return true;
  }
  const rgbMatch = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    if (Math.max(r, g, b) < 170) {
      return true;
    }
  }
  const hexMatch = str.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (hexMatch) {
    const r = parseInt(hexMatch[1], 16);
    const g = parseInt(hexMatch[2], 16);
    const b = parseInt(hexMatch[3], 16);
    if (Math.max(r, g, b) < 170) {
      return true;
    }
  }
  return false;
}

export default function FormattedContent({ content = '', className = '' }) {
  if (!content) return null;

  // Check if content appears to be HTML (produced by React Quill or rich text editor)
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  const baseProseClasses = `prose prose-slate dark:prose-invert max-w-none 
    prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-slate-100 
    prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed 
    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-700
    prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-li:text-slate-700 dark:prose-li:text-slate-300
    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl
    prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono
    prose-img:rounded-2xl prose-img:shadow-md
    ${className}`;

  if (isHtml) {
    // Remove hardcoded black/dark-gray text colors or white backgrounds from Word/Google Docs paste
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
      if (node.style) {
        const color = node.style.color || '';
        const bg = node.style.backgroundColor || '';
        if (isDarkOrGray(color)) {
          node.style.removeProperty('color');
        }
        if (/rgb\(\s*255,\s*255,\s*255\s*\)|#ffffff|#fff|white|transparent/i.test(bg)) {
          node.style.removeProperty('background-color');
        }
        if (node.getAttribute('style')?.trim() === '') {
          node.removeAttribute('style');
        }
      }
      if (node.hasAttribute('color') && isDarkOrGray(node.getAttribute('color'))) {
        node.removeAttribute('color');
      }
    });

    const sanitizedHtml = DOMPurify.sanitize(content, {
      ADD_TAGS: ['iframe'], // allow embedded videos if needed
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target']
    });

    DOMPurify.removeHook('afterSanitizeAttributes');

    return (
      <div
        className={baseProseClasses}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    );
  }

  // Fallback for legacy plain markdown content
  return (
    <div className={baseProseClasses}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
