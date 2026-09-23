import { ALPHABET } from './defaults';

// Character sets from nanoid-dictionary (MIT License,
// Copyright (c) 2018 Stanislav Lashmanov):
// https://github.com/CyberAP/nanoid-dictionary
export const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const lowercase = 'abcdefghijklmnopqrstuvwxyz';
export const numbers = '0123456789';
export const alphanumeric = numbers + lowercase + uppercase;
export const hexadecimalUppercase = numbers + 'ABCDEF';
export const hexadecimalLowercase = numbers + 'abcdef';

export const nolookalikes = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz';

// conforms to https://www.rfc-editor.org/rfc/rfc6265.txt
export const cookieSafe = alphanumeric + "!#$%&'*+-.^_`|~";
// actually works in browsers https://stackoverflow.com/a/1969339
export const cookieUnsafe = alphanumeric + "!#$%&'()*+-./:<=>?@[]^_`{|}~";

export interface AlphabetPreset {
  id: string;
  label: string;
  value: string;
}

export const DEFAULT_PRESET_ID = 'nanoid';

/** Sentinel value of the non-selectable "User defined" option in the preset dropdown. */
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
  { id: 'cookie-safe', label: 'Cookie (safe)', value: cookieSafe },
  { id: 'cookie-unsafe', label: 'Cookie (unsafe)', value: cookieUnsafe },
];

export function getPreset(id: string): AlphabetPreset | undefined {
  return ALPHABET_PRESETS.find((preset) => preset.id === id);
}
