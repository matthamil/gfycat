import { stringifyQueryParams, isExpired } from './../src/utils';
describe('utils', () => {
  it('should return true when given ms timestamp occurred before now', () => {
    const result = isExpired(1);
    expect(result).toBe(true);
  });

  it('should stringify and append the given query params to the given url only when they are not undefined', () => {
    const url = stringifyQueryParams({
      url: '/foo',
      params: {
        color: 'blue',
        day: 'monday',
        cursor: undefined,
      },
    });
    expect(url.includes('cursor')).toBe(false);
    expect([
      '/foo?color=blue&day=monday',
      '/foo?day=monday&color=blue',
    ]).toContain(url);
  });
});
