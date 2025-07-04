import Navigation from '@/components/navigation'
import DashboardStats from '@/components/dashboard-stats'
import PerformanceChart from '@/components/performance-chart'
import SymbolsChart from '@/components/symbols-chart'
import TradeEntryForm from '@/components/trade-entry-form'
import TradeHistory from '@/components/trade-history'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Dashboard Statistics */}
        <div className="mb-8">
          <DashboardStats />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Analytics */}
          <div className="lg:col-span-2 space-y-8">
            <PerformanceChart />
            <SymbolsChart />
          </div>

          {/* Right Column - Trade Entry */}
          <div className="lg:col-span-1">
            <TradeEntryForm />
          </div>
        </div>

        {/* Trade History */}
        <div>
          <TradeHistory />
        </div>
      </main>
    </div>
  )
}