import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  ALPHABET_PRESETS,
  CUSTOM_PRESET_VALUE,
  DEFAULT_PRESET_ID,
  getPreset,
  getPresetByValue,
} from './alphabets';

test('presets have unique ids, unique values and non-empty labels', () => {
  const ids = ALPHABET_PRESETS.map((preset) => preset.id);
  assert.equal(new Set(ids).size, ids.length, 'ids must be unique');
  assert.ok(!ids.includes(CUSTOM_PRESET_VALUE), 'sentinel must not collide with a preset id');

  const values = ALPHABET_PRESETS.map((preset) => preset.value);
  assert.equal(new Set(values).size, values.length, 'values must be unique');

  for (const preset of ALPHABET_PRESETS) {
    assert.ok(preset.label.length > 0, `preset ${preset.id} must have a label`);
    assert.ok(preset.value.length >= 2, `preset ${preset.id} must have a usable alphabet`);
  }
});

test('DEFAULT_PRESET_ID points to an existing preset', () => {
  assert.equal(getPreset(DEFAULT_PRESET_ID)?.id, DEFAULT_PRESET_ID);
});

test('getPreset resolves by id and returns undefined for unknown ids', () => {
  assert.equal(getPreset('numbers')?.id, 'numbers');
  assert.equal(getPreset(CUSTOM_PRESET_VALUE), undefined);
  assert.equal(getPreset('does-not-exist'), undefined);
});

test('getPresetByValue resolves by value and returns undefined for unknown values', () => {
  assert.equal(getPresetByValue('0123456789')?.id, 'numbers');
  assert.equal(getPresetByValue('custom-xyz'), undefined);
  assert.equal(getPresetByValue(''), undefined);

  for (const preset of ALPHABET_PRESETS) {
    assert.equal(getPresetByValue(preset.value)?.id, preset.id);
  }
});
