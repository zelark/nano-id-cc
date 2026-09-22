import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { customAlphabet, nanoid } from 'nanoid';
import { ALPHABET, LENGTH } from './defaults';
import type { State } from './state';

hljs.registerLanguage('javascript', javascript);

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
      "const { nanoid } = require('nanoid');\n" +
      `nanoid(${sizeArg}); //=> "${id}"`
    );
  }

  const id = customAlphabet(alphabet, length)();
  return (
    "const { customAlphabet } = require('nanoid');\n" +
    `const alphabet = '${escape(alphabet)}';\n` +
    `const nanoid = customAlphabet(alphabet, ${length});\n` +
    `nanoid() //=> "${id}"`
  );
}

export function highlightCode(element: HTMLElement): void {
  const code = element.textContent ?? '';
  element.innerHTML = hljs.highlight(code, { language: 'javascript' }).value;
  element.classList.add('hljs');
}
