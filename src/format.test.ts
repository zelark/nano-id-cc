import { test } from 'node:test';
import assert from 'node:assert/strict';

import { ALPHABET } from './defaults';
import { formatResult, formatTime, pluralize } from './format';
import type { State } from './state';

test('pluralize', () => {
  assert.equal(pluralize(1, 'second'), 'second');
  assert.equal(pluralize(2, 'second'), 'seconds');
  assert.equal(pluralize(0, 'year'), 'years');
  assert.equal(pluralize('1', 'ID'), 'ID');
  assert.equal(pluralize('1,307,660T', 'ID'), 'IDs');
});

test('formatTime seconds, minutes, hours and days', () => {
  assert.equal(formatTime(0), '~0 seconds');
  assert.equal(formatTime(1), '~1 second');
  assert.equal(formatTime(59), '~59 seconds');
  assert.equal(formatTime(60), '~1 minute');
  assert.equal(formatTime(3600), '~1 hour');
  assert.equal(formatTime(86400), '~1 day');
});

test('formatTime years and beyond', () => {
  assert.equal(formatTime(63_116_928), '~2 years');
  assert.equal(formatTime(63_116_928_000), '~2 thousand years');
  assert.equal(formatTime(Infinity), 'More than 1 quadrillion years');
  assert.equal(formatTime(NaN), 'More than 1 quadrillion years');
});

test('formatResult default matches the known value', () => {
  const state: State = { unit: 'hour', speed: 1000, length: 21, customAlphabet: ALPHABET, preset: null };
  assert.equal(formatResult(state), '~149 billion years or 1,307,660T IDs');
});

test('formatResult treats hour and second speeds equivalently', () => {
  const perHour: State = { unit: 'hour', speed: 3600, length: 21, customAlphabet: ALPHABET, preset: null };
  const perSecond: State = { unit: 'second', speed: 1, length: 21, customAlphabet: ALPHABET, preset: null };
  assert.equal(formatResult(perHour), formatResult(perSecond));
});

test('formatResult deduplicates the alphabet', () => {
  const withDuplicates: State = { unit: 'hour', speed: 1000, length: 21, customAlphabet: 'aabbcc', preset: null };
  const deduplicated: State = { unit: 'hour', speed: 1000, length: 21, customAlphabet: 'abc', preset: null };
  assert.equal(formatResult(withDuplicates), formatResult(deduplicated));
});
