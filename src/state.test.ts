import { test } from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_PRESET_ID } from './alphabets';
import { ALPHABET } from './defaults';
import { getAlphabet } from './state';
import type { State } from './state';

test('getAlphabet returns the selected preset alphabet', () => {
  const state: State = {
    unit: 'hour',
    speed: 1000,
    length: 21,
    preset: 'numbers',
    customAlphabet: 'abc',
  };
  assert.equal(getAlphabet(state), '0123456789');
});

test('getAlphabet returns the custom alphabet when no preset is selected', () => {
  const state: State = {
    unit: 'hour',
    speed: 1000,
    length: 21,
    preset: null,
    customAlphabet: 'abc',
  };
  assert.equal(getAlphabet(state), 'abc');
});

test('getAlphabet falls back to the custom alphabet for an unknown preset id', () => {
  const state: State = {
    unit: 'hour',
    speed: 1000,
    length: 21,
    preset: 'does-not-exist',
    customAlphabet: 'abc',
  };
  assert.equal(getAlphabet(state), 'abc');
});

test('getAlphabet resolves the default preset to the Nano ID alphabet', () => {
  const state: State = {
    unit: 'hour',
    speed: 1000,
    length: 21,
    preset: DEFAULT_PRESET_ID,
    customAlphabet: 'abc',
  };
  assert.equal(getAlphabet(state), ALPHABET);
});
