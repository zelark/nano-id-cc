import {
  alphanumeric,
  cookieSafe,
  cookieUnsafe,
  hexadecimalLowercase,
  hexadecimalUppercase,
  lowercase,
  nolookalikes,
  nolookalikesSafe,
  numbers,
  uppercase,
} from 'nanoid-dictionary';
import { ALPHABET } from './defaults';

export interface AlphabetPreset {
  id: string;
  label: string;
  value: string;
}

export const DEFAULT_PRESET_ID = 'nanoid';

/** Sentinel value of the non-selectable "Custom" option in the preset dropdown. */
export const CUSTOM_PRESET_VALUE = '__custom__';

export const ALPHABET_PRESETS: AlphabetPreset[] = [
  { id: DEFAULT_PRESET_ID, label: 'Nano ID default', value: ALPHABET },
  { id: 'numbers', label: 'Numbers', value: numbers },
  { id: 'lowercase', label: 'Lowercase', value: lowercase },
  { id: 'uppercase', label: 'Uppercase', value: uppercase },
  { id: 'alphanumeric', label: 'Alphanumeric', value: alphanumeric },
  { id: 'hex-lower', label: 'Hex lowercase', value: hexadecimalLowercase },
  { id: 'hex-upper', label: 'Hex uppercase', value: hexadecimalUppercase },
  { id: 'nolookalikes', label: 'No look-alikes', value: nolookalikes },
  { id: 'nolookalikes-safe', label: 'No look-alikes (safe)', value: nolookalikesSafe },
  { id: 'cookie-unsafe', label: 'Cookie', value: cookieUnsafe },
  { id: 'cookie-safe', label: 'Cookie (safe)', value: cookieSafe },
];

export function getPreset(id: string): AlphabetPreset | undefined {
  return ALPHABET_PRESETS.find((preset) => preset.id === id);
}
