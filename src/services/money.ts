import Decimal from 'decimal.js';

export function centsToDecimal(cents: number): Decimal {
  return new Decimal(cents).dividedBy(100);
}

export function decimalToCents(decimal: Decimal | number | string): number {
  return new Decimal(decimal).times(100).toNumber();
}

export function add(a: number, b: number): number {
  const decimalA = centsToDecimal(a);
  const decimalB = centsToDecimal(b);
  return decimalToCents(decimalA.plus(decimalB));
}

export function subtract(a: number, b: number): number {
  const decimalA = centsToDecimal(a);
  const decimalB = centsToDecimal(b);
  return decimalToCents(decimalA.minus(decimalB));
}

export function multiply(cents: number, multiplier: number): number {
  const decimal = centsToDecimal(cents);
  return decimalToCents(decimal.times(multiplier));
}

export function divide(cents: number, divisor: number): number {
  if (divisor === 0) {
    throw new Error('Cannot divide by zero');
  }
  const decimal = centsToDecimal(cents);
  return decimalToCents(decimal.dividedBy(divisor));
}

export function formatCurrency(
  cents: number,
  currency: string = 'SGD',
  locale: string = 'en-SG'
): string {
  const decimal = centsToDecimal(cents);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(decimal.toNumber());
}

export function formatCurrencyCompact(
  cents: number,
  currency: string = 'SGD',
  locale: string = 'en-SG'
): string {
  const decimal = centsToDecimal(cents);
  const value = decimal.toNumber();

  const absValue = Math.abs(value);

  if (absValue >= 1_000_000) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      notation: 'compact',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }

  if (absValue >= 1_000) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value);
  }

  return formatCurrency(cents, currency, locale);
}
