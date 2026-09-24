import { criticalNumber, randomBits, timeToCollision } from './calc';
import { getAlphabet } from './state';
import type { State } from './state';

interface TimeUnit {
  num: number;
  asIs: boolean;
  ending: string;
}

const units: TimeUnit[] = [
  { num: 60, asIs: false, ending: 'second' },
  { num: 60, asIs: false, ending: 'minute' },
  { num: 24, asIs: false, ending: 'hour' },
  { num: 365.26, asIs: false, ending: 'day' },
  { num: 1000, asIs: false, ending: 'year' },
  { num: 1000, asIs: true, ending: 'thousand years' },
  { num: 1000, asIs: true, ending: 'million years' },
  { num: 1000, asIs: true, ending: 'billion years' },
  { num: 1000, asIs: true, ending: 'trillion years' },
  { num: 1000, asIs: true, ending: 'More than 1 quadrillion years' },
];

const numberFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  roundingMode: 'floor',
  maximumFractionDigits: 0,
});

export function pluralize(n: number | string, word: string): string {
  if (n === 1 || n === '1') return word;
  return word + 's';
}

export function formatTime(time: number): string {
  let current = time;

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const next = current / unit.num;

    if (i === units.length - 1) {
      return unit.ending;
    }

    if (next < 1) {
      const n = Math.round(current);
      return '~' + n + ' ' + (unit.asIs ? unit.ending : pluralize(n, unit.ending));
    }

    current = next;
  }

  return units[units.length - 1].ending;
}

function uniqueChars(value: string): string {
  return [...new Set(value)].join('');
}

export function formatResult(state: State): string {
  const alphabet = uniqueChars(getAlphabet(state));
  const speed = state.unit === 'hour' ? state.speed / 3600 : state.speed;
  const bits = randomBits(alphabet.length, state.length);
  const probability = 0.01;
  const numberIds = criticalNumber(bits, probability);
  const time = timeToCollision(numberIds, speed);
  const formattedIds = numberFormatter.format(numberIds);

  return formatTime(time) + ' or ' + formattedIds + ' ' + pluralize(formattedIds, 'ID');
}
