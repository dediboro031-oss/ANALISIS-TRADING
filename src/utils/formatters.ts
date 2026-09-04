import { USD_TO_IDR_RATE } from '../data/initialData';

export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

export const formatPercent = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const convertUsdToIdr = (usd: number): number => {
  return usd * USD_TO_IDR_RATE;
};

export const convertIdrToUsd = (idr: number): number => {
  return idr / USD_TO_IDR_RATE;
};

export const calculatePips = (pair: string, openPrice: number, closePrice: number, type: 'BUY' | 'SELL'): number => {
  const isJpy = pair.includes('JPY');
  const isGold = pair.includes('XAU') || pair.includes('GOLD');
  const isCrypto = pair.includes('BTC') || pair.includes('ETH');
  
  const diff = type === 'BUY' ? closePrice - openPrice : openPrice - closePrice;
  
  if (isJpy) {
    return parseFloat((diff * 100).toFixed(1));
  } else if (isGold) {
    return parseFloat((diff * 10).toFixed(1));
  } else if (isCrypto) {
    return parseFloat(diff.toFixed(1));
  } else {
    return parseFloat((diff * 10000).toFixed(1));
  }
};

export const calculateProfitUSD = (pair: string, lots: number, pips: number): number => {
  const isJpy = pair.includes('JPY');
  const isGold = pair.includes('XAU');
  const isCrypto = pair.includes('BTC');

  if (isGold) {
    // 1 lot gold = 100 oz. 1 pip ($0.10) = $10 per lot
    return parseFloat((lots * pips * 10).toFixed(2));
  } else if (isJpy) {
    // standard lot 100,000 JPY ~$6.5 - $7 per pip
    return parseFloat((lots * pips * 6.8).toFixed(2));
  } else if (isCrypto) {
    return parseFloat((lots * pips).toFixed(2));
  } else {
    // Standard major pairs EUR/USD, GBP/USD: 1 lot 1 pip = $10
    return parseFloat((lots * pips * 10).toFixed(2));
  }
};
