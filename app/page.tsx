import Navigation from '@/components/navigation'
import DashboardStats from '@/components/dashboard-stats'
import PerformanceChart from '@/components/performance-chart'
import SymbolsChart from '@/components/symbols-chart'
import TradeEntryForm from '@/components/trade-entry-form'
import TradeHistory from '@/components/trade-history'
import { getSymbols, getTrades, initializeData } from '@/lib/redis-schema'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Initialize Redis data structures if needed
  await initializeData();
  
  // Get data from Redis
  const symbols = await getSymbols();
  const trades = await getTrades();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Dashboard Statistics */}
        <div className="mb-8">
          <DashboardStats trades={trades} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left Column - Performance Chart */}
          <div className="lg:col-span-8">
            <PerformanceChart trades={trades} />
          </div>

          {/* Right Column - Trade Entry */}
          <div className="lg:col-span-4">
            <TradeEntryForm symbols={symbols} />
          </div>
        </div>

        {/* Trade History and Symbols Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Trade History Table */}
          <div className="lg:col-span-8">
            <TradeHistory trades={trades} symbols={symbols} />
          </div>
          
          {/* Symbols Distribution Chart */}
          <div className="lg:col-span-4">
            <SymbolsChart symbols={symbols} />
          </div>
        </div>
      </main>
    </div>
  )
}