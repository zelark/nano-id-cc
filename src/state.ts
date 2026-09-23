import { DEFAULT_PRESET_ID } from './alphabets';
import { ALPHABET, LENGTH } from './defaults';

export type Unit = 'hour' | 'second';

export interface State {
  unit: Unit;
  speed: number;
  length: number;
  alphabet: string;
  /** Id of the selected alphabet preset, or `null` when the alphabet is custom. */
  preset: string | null;
}

export const initialState: State = {
  unit: 'hour',
  speed: 1000,
  length: LENGTH,
  alphabet: ALPHABET,
  preset: DEFAULT_PRESET_ID,
};

type Listener = (state: State) => void;

let current: State = { ...initialState };
const listeners = new Set<Listener>();

export function getState(): State {
  return current;
}

export function setState(patch: Partial<State>): void {
  current = { ...current, ...patch };
  for (const listener of listeners) {
    listener(current);
  }
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
