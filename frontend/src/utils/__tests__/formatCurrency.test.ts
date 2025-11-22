import { formatCurrency } from '../formatCurrency';

describe('formatCurrency Utility', () => {
  it('should format positive numbers as currency', () => {
    const result = formatCurrency(100);
    expect(result).toContain('100');
  });

  it('should format large numbers correctly', () => {
    const result = formatCurrency(1500.50);
    expect(result).toContain('1.500');
  });

  it('should format zero correctly', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('should format negative numbers', () => {
    const result = formatCurrency(-100);
    expect(result).toContain('-');
  });

  it('should format decimal values', () => {
    const result = formatCurrency(99.99);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
