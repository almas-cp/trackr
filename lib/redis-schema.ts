import { redis } from './redis';

// Data types
export interface Symbol {
  name: string;
  trades?: number;
}

export interface Trade {
  id: string;
  date: string;
  symbol: string;
  action: 'buy' | 'sell';
  size: number;
  pnl: number;
  notes: string;
}

// Key definitions
const KEYS = {
  SYMBOLS: 'symbols',
  TRADES: 'trades',
  TRADE_COUNTER: 'trade_counter'
};

// Helper functions for Symbols
export async function getSymbols(): Promise<Symbol[]> {
  const symbols = await redis.get<Symbol[]>(KEYS.SYMBOLS) || [];
  return symbols;
}

export async function addSymbol(symbolName: string): Promise<boolean> {
  const symbols = await getSymbols();
  
  // Check if symbol already exists
  if (symbols.some(s => s.name === symbolName)) {
    return false;
  }
  
  // Add new symbol
  symbols.push({ name: symbolName, trades: 0 });
  await redis.set(KEYS.SYMBOLS, symbols);
  return true;
}

export async function deleteSymbol(symbolName: string): Promise<boolean> {
  const symbols = await getSymbols();
  const newSymbols = symbols.filter(s => s.name !== symbolName);
  
  if (symbols.length === newSymbols.length) {
    return false; // Symbol not found
  }
  
  await redis.set(KEYS.SYMBOLS, newSymbols);
  return true;
}

// Helper functions for Trades
export async function getTrades(): Promise<Trade[]> {
  const trades = await redis.get<Trade[]>(KEYS.TRADES) || [];
  return trades;
}

export async function getTradeById(id: string): Promise<Trade | null> {
  const trades = await getTrades();
  return trades.find(t => t.id === id) || null;
}

export async function addTrade(trade: Omit<Trade, 'id'>): Promise<Trade> {
  // Get next trade ID
  const tradeId = await redis.incr(KEYS.TRADE_COUNTER);
  
  const newTrade: Trade = {
    ...trade,
    id: `trade_${tradeId}`
  };
  
  // Add to trades list
  const trades = await getTrades();
  trades.push(newTrade);
  await redis.set(KEYS.TRADES, trades);
  
  // Update symbol trade count
  const symbols = await getSymbols();
  const symbolIndex = symbols.findIndex(s => s.name === trade.symbol);
  if (symbolIndex >= 0) {
    symbols[symbolIndex].trades = (symbols[symbolIndex].trades || 0) + 1;
    await redis.set(KEYS.SYMBOLS, symbols);
  }
  
  return newTrade;
}

export async function updateTrade(updatedTrade: Trade): Promise<boolean> {
  const trades = await getTrades();
  const tradeIndex = trades.findIndex(t => t.id === updatedTrade.id);
  
  if (tradeIndex === -1) {
    return false; // Trade not found
  }
  
  const oldTrade = trades[tradeIndex];
  trades[tradeIndex] = updatedTrade;
  await redis.set(KEYS.TRADES, trades);
  
  // Update symbol trade counts if symbol changed
  if (oldTrade.symbol !== updatedTrade.symbol) {
    const symbols = await getSymbols();
    
    // Decrease count for old symbol
    const oldSymbolIndex = symbols.findIndex(s => s.name === oldTrade.symbol);
    if (oldSymbolIndex >= 0 && symbols[oldSymbolIndex].trades) {
      symbols[oldSymbolIndex].trades = Math.max(0, (symbols[oldSymbolIndex].trades || 0) - 1);
    }
    
    // Increase count for new symbol
    const newSymbolIndex = symbols.findIndex(s => s.name === updatedTrade.symbol);
    if (newSymbolIndex >= 0) {
      symbols[newSymbolIndex].trades = (symbols[newSymbolIndex].trades || 0) + 1;
    }
    
    await redis.set(KEYS.SYMBOLS, symbols);
  }
  
  return true;
}

export async function deleteTrade(id: string): Promise<boolean> {
  const trades = await getTrades();
  const tradeToDelete = trades.find(t => t.id === id);
  
  if (!tradeToDelete) {
    return false;
  }
  
  const newTrades = trades.filter(t => t.id !== id);
  await redis.set(KEYS.TRADES, newTrades);
  
  // Update symbol trade count
  const symbols = await getSymbols();
  const symbolIndex = symbols.findIndex(s => s.name === tradeToDelete.symbol);
  if (symbolIndex >= 0 && symbols[symbolIndex].trades) {
    symbols[symbolIndex].trades = Math.max(0, (symbols[symbolIndex].trades || 0) - 1);
    await redis.set(KEYS.SYMBOLS, symbols);
  }
  
  return true;
}

// Initialize data if not exists
export async function initializeData(): Promise<void> {
  // Initialize symbols if not exists
  if (!await redis.exists(KEYS.SYMBOLS)) {
    await redis.set(KEYS.SYMBOLS, []);
  }
  
  // Initialize trades if not exists
  if (!await redis.exists(KEYS.TRADES)) {
    await redis.set(KEYS.TRADES, []);
  }
  
  // Initialize counter if not exists
  if (!await redis.exists(KEYS.TRADE_COUNTER)) {
    await redis.set(KEYS.TRADE_COUNTER, 0);
  }
} 