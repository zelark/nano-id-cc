import { codeSample, highlightCode } from './code-sample';
import { formatResult } from './format';
import { getState, setState, subscribe } from './state';
import type { Unit } from './state';

function getElement<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

const alphabet = getElement<HTMLTextAreaElement>('alphabet');
const length = getElement<HTMLInputElement>('length');
const speed = getElement<HTMLInputElement>('speed');
const slider = getElement<HTMLInputElement>('length-slider');
const counter = getElement<HTMLSpanElement>('counter');
const result = getElement<HTMLElement>('result');
const codeSampleEl = getElement<HTMLElement>('code-sample');
const copyBtn = getElement<HTMLButtonElement>('copy-btn');
const radioButtons = Array.from(
  document.querySelectorAll<HTMLInputElement>('input[type=radio]'),
);

let prevAlphabet = '';
let prevLength = -1;

const COPY_FEEDBACK_MS = 1500;
let copyFeedbackTimer: number | undefined;

function flashCopyState(className: 'copied' | 'copy-error'): void {
  copyBtn.classList.remove('copied', 'copy-error');
  // Force a reflow so re-adding the class restarts the CSS animation.
  void copyBtn.offsetWidth;
  copyBtn.classList.add(className);
  window.clearTimeout(copyFeedbackTimer);
  copyFeedbackTimer = window.setTimeout(() => {
    copyBtn.classList.remove(className);
    copyFeedbackTimer = undefined;
  }, COPY_FEEDBACK_MS);
}

function render(): void {
  const state = getState();
  const { alphabet: alphabetValue, length: lengthValue, speed: speedValue, unit } = state;

  // Alphabet field and counter.
  const len = alphabetValue.length;
  const spoiledAlphabet = len < 2 || new Set(alphabetValue).size !== len;
  alphabet.classList.toggle('spoiled', spoiledAlphabet);
  if (alphabet.value !== alphabetValue) alphabet.value = alphabetValue;
  counter.textContent = `${len}/256`;

  // Length display and slider.
  const lengthString = String(lengthValue);
  if (length.value !== lengthString) length.value = lengthString;
  if (slider.value !== lengthString) slider.value = lengthString;

  // Speed field.
  const spoiledSpeed = speedValue < 1;
  speed.classList.toggle('spoiled', spoiledSpeed);
  if (speed.value !== String(speedValue)) speed.value = String(speedValue);

  // Unit radio buttons.
  for (const button of radioButtons) {
    button.checked = button.value === unit;
  }

  // Result text.
  result.textContent = formatResult(state);

  // Code sample is regenerated only when the alphabet or length changes.
  if (alphabetValue !== prevAlphabet || lengthValue !== prevLength) {
    prevAlphabet = alphabetValue;
    prevLength = lengthValue;

    if (len < 2) {
      codeSampleEl.innerHTML = '<img class="boom" src="boom.jpg" alt="BOOM!!!">';
    } else {
      codeSampleEl.textContent = codeSample(state);
      highlightCode(codeSampleEl);
    }
  }
}

export function init(): void {
  alphabet.addEventListener('input', (event) => {
    const target = event.target as HTMLTextAreaElement;
    if (target.value.length <= 256) {
      setState({ alphabet: target.value });
    } else {
      target.value = getState().alphabet;
    }
  });

  slider.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    setState({ length: parseInt(target.value, 10) });
  });

  speed.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    const value = target.valueAsNumber;
    if (Number.isNaN(value) || value > 1_000_000_000 || value < -1_000_000_000) {
      target.value = String(getState().speed);
    } else {
      setState({ speed: value });
    }
  });

  copyBtn.addEventListener('click', () => {
    if (!navigator.clipboard) {
      console.error('Clipboard API is not available in this context.');
      flashCopyState('copy-error');
      return;
    }

    navigator.clipboard.writeText(codeSampleEl.textContent ?? '').then(
      () => flashCopyState('copied'),
      (error: unknown) => {
        console.error('Failed to copy snippet:', error);
        flashCopyState('copy-error');
      },
    );
  });

  for (const button of radioButtons) {
    button.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      setState({ unit: target.value as Unit });
    });
  }

  subscribe(render);
  render();
  slider.focus();
}

init();
