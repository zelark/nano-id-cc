import { test } from 'node:test';
import assert from 'node:assert/strict';

import { criticalNumber, randomBits, timeToCollision } from './calc';

function closeTo(actual: number, expected: number, relTol: number): void {
  const tol = Math.abs(expected) * relTol;
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${actual} to be within ${relTol * 100}% of ${expected}`,
  );
}

test('randomBits', () => {
  closeTo(randomBits(64, 21), 126, 1e-9);
  closeTo(randomBits(2, 10), 10, 1e-9);
  assert.equal(randomBits(1, 21), 0);
  assert.equal(randomBits(0, 21), -Infinity);
});

test('criticalNumber', () => {
  // ~1.31e18 IDs for a 126-bit ID at 1% collision probability.
  closeTo(criticalNumber(126, 0.01), 1.31e18, 1e-2);
  // With zero bits it reduces to sqrt(2 * ln(1 / (1 - p))).
  closeTo(criticalNumber(0, 0.01), Math.sqrt(2 * Math.log(100 / 99)), 1e-12);
  assert.equal(criticalNumber(-Infinity, 0.01), 0);
});

test('timeToCollision floors toward zero', () => {
  assert.equal(timeToCollision(10, 2), 5);
  assert.equal(timeToCollision(10, 3), 3);
  assert.equal(timeToCollision(0, 5), 0);
});
