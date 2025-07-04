import { redis } from '../lib/redis';
import { initializeData, addSymbol, addTrade } from '../lib/redis-schema';

async function main() {
  try {
    console.log('Initializing Redis data structures...');
    await initializeData();
    
    // Clear existing data
    await redis.del('symbols');
    await redis.del('trades');
    await redis.del('trade_counter');
    
    console.log('Adding sample symbols...');
    const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'];
    
    for (const symbol of symbols) {
      await addSymbol(symbol);
      console.log(`Added symbol: ${symbol}`);
    }
    
    console.log('Adding sample trades...');
    const sampleTrades = [
      {
        date: '2024-01-15',
        symbol: 'EURUSD',
        action: 'buy' as const,
        size: 0.1,
        pnl: 125.50,
        notes: 'Strong bullish momentum'
      },
      {
        date: '2024-01-14',
        symbol: 'GBPUSD',
        action: 'sell' as const,
        size: 0.05,
        pnl: -45.20,
        notes: 'Hit stop loss'
      },
      {
        date: '2024-01-13',
        symbol: 'USDJPY',
        action: 'buy' as const,
        size: 0.08,
        pnl: 89.75,
        notes: 'Breakout confirmed'
      },
      {
        date: '2024-01-12',
        symbol: 'AUDUSD',
        action: 'sell' as const,
        size: 0.12,
        pnl: 67.30,
        notes: 'Resistance rejection'
      },
      {
        date: '2024-01-11',
        symbol: 'USDCAD',
        action: 'buy' as const,
        size: 0.06,
        pnl: -23.80,
        notes: 'False breakout'
      }
    ];
    
    for (const trade of sampleTrades) {
      await addTrade(trade);
      console.log(`Added trade for ${trade.symbol}`);
    }
    
    console.log('Redis initialized with sample data successfully!');
  } catch (error) {
    console.error('Failed to initialize Redis with sample data:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 