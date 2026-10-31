import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { greet, sum, MAX_NAME_LENGTH } from '../src/lib.js';

describe('greet()', () => {
  it('greets the world when no name is given', () => {
    assert.equal(greet(), 'Hello, World!');
    assert.equal(greet('   '), 'Hello, World!');
  });

  it('greets a trimmed name', () => {
    assert.equal(greet('  Ada  '), 'Hello, Ada!');
  });

  it('truncates very long names', () => {
    const message = greet('x'.repeat(500));
    assert.equal(message, `Hello, ${'x'.repeat(MAX_NAME_LENGTH)}!`);
  });
});

describe('sum()', () => {
  it('adds integers and decimals', () => {
    assert.equal(sum([1, 2, 3]), 6);
    assert.equal(sum([-2.5, 2.5, 10]), 10);
  });

  it('rejects empty, non-array and non-numeric input', () => {
    assert.throws(() => sum([]), TypeError);
    assert.throws(() => sum('1,2,3'), TypeError);
    assert.throws(() => sum([1, '2']), TypeError);
    assert.throws(() => sum([1, Number.NaN]), TypeError);
  });
});
