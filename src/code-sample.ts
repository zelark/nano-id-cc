import { customAlphabet, nanoid } from 'nanoid';
import { ALPHABET, LENGTH } from './defaults';
import type { State } from './state';

function escape(value: string): string {
  return value.replace(/(['\\])/g, (match) => (match === "'" ? "\\'" : '\\\\'));
}

export function codeSample(state: State): string {
  const { alphabet, length } = state;
  const custom = alphabet !== ALPHABET;
  const sizeArg = length === LENGTH ? '' : String(length);

  if (!custom) {
    const id = nanoid(length);
    return (
      "import { nanoid } from 'nanoid';\n" +
      `nanoid(${sizeArg}); //=> "${id}"`
    );
  }

  const id = customAlphabet(alphabet, length)();
  return (
    "import { customAlphabet } from 'nanoid';\n" +
    `const alphabet = '${escape(alphabet)}';\n` +
    `const nanoid = customAlphabet(alphabet, ${length});\n` +
    `nanoid() //=> "${id}"`
  );
}

// Tiny highlighter for the fixed snippets above: comments, strings, numbers,
// and the `const`/`import`/`from` keywords. Reuses the existing `hljs-*` CSS
// classes so the visuals stay identical.
const TOKEN = /(\/\/[^\n]*)|('(?:[^'\\\n]|\\.)*')|(\b\d+\b)|(\b(?:const|import|from)\b)/g;

function escapeHtml(value: string): string {
  return value.replace(/[&<>]/g, (c) => (c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;'));
}

function tokenClass(match: RegExpExecArray): string {
  if (match[1]) return 'hljs-comment';
  if (match[2]) return 'hljs-string';
  if (match[3]) return 'hljs-number';
  return 'hljs-keyword';
}

function highlight(code: string): string {
  let out = '';
  let last = 0;
  let match: RegExpExecArray | null;

  TOKEN.lastIndex = 0;
  while ((match = TOKEN.exec(code)) !== null) {
    out += escapeHtml(code.slice(last, match.index));
    out += `<span class="${tokenClass(match)}">${escapeHtml(match[0])}</span>`;
    last = match.index + match[0].length;
  }

  return out + escapeHtml(code.slice(last));
}

export function highlightCode(element: HTMLElement): void {
  element.innerHTML = highlight(element.textContent ?? '');
  element.classList.add('hljs');
}
