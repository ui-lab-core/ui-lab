import { describe, expect, it } from 'vitest';
import {
  createStylePropsResolver,
  createStylesResolver,
  type StylesProp,
} from '../styles';
import type { StyleValue } from '../utils';

interface StyleSlots {
  root?: StyleValue;
  icon?: StyleValue;
}

type TestStyles = StylesProp<StyleSlots>;

const validRoot: TestStyles = { root: 'root' };
const validConditionalRoot: TestStyles = { root: ['base', false, 'active'] };
const validNamedSlot: TestStyles = { icon: 'icon' };

// @ts-expect-error styles must be a keyed map
const invalidString: TestStyles = 'root';
// @ts-expect-error styles must be a keyed map
const invalidArray: TestStyles = ['root', false];
// @ts-expect-error inline style objects belong inside an individual slot
const invalidInlineStyle: TestStyles = { color: 'red' };

void [validRoot, validConditionalRoot, validNamedSlot, invalidString, invalidArray, invalidInlineStyle];

describe('createStylesResolver', () => {
  const resolve = createStylesResolver(['root', 'icon'] as const);

  // @ts-expect-error resolver input must be a keyed map
  resolve('root');
  // @ts-expect-error resolver input must be a keyed map
  resolve(['root', false]);
  // @ts-expect-error arbitrary objects are not root inline styles
  resolve({ color: 'red' });

  it('returns empty slots for undefined', () => {
    expect(resolve(undefined)).toEqual({ root: '', icon: '' });
  });

  it('resolves root strings and conditional arrays', () => {
    expect(resolve({ root: 'root' })).toEqual({ root: 'root', icon: '' });
    expect(resolve({ root: ['base', false, 'active'] })).toEqual({ root: 'base active', icon: '' });
  });

  it('resolves named slots independently', () => {
    expect(resolve({ root: 'root', icon: 'icon' })).toEqual({ root: 'root', icon: 'icon' });
  });
});

describe('createStylePropsResolver', () => {
  const resolve = createStylePropsResolver(['root', 'icon'] as const);

  // @ts-expect-error resolver input must be a keyed map
  resolve('root');
  // @ts-expect-error resolver input must be a keyed map
  resolve(['root', false]);
  // @ts-expect-error arbitrary objects are not root inline styles
  resolve({ color: 'red' });

  it('returns empty slots for undefined', () => {
    expect(resolve(undefined)).toEqual({ root: { className: '' }, icon: { className: '' } });
  });

  it('resolves root and named slot classes independently', () => {
    expect(resolve({ root: ['base', false, 'active'], icon: 'icon' })).toEqual({
      root: { className: 'base active' },
      icon: { className: 'icon' },
    });
  });

  it('preserves rich per-slot className and inline style values', () => {
    expect(resolve({
      root: { className: ['base', false, 'active'], style: { color: 'red' } },
      icon: { width: 16 },
    })).toEqual({
      root: { className: 'base active', style: { color: 'red' } },
      icon: { className: '', style: { width: 16 } },
    });
  });
});
