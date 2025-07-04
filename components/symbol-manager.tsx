"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PlusCircle, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { addSymbol, deleteSymbol, Symbol } from '@/lib/redis-schema'

interface SymbolManagerProps {
  initialSymbols: Symbol[]
}

export default function SymbolManager({ initialSymbols }: SymbolManagerProps) {
  const [symbols, setSymbols] = useState<Symbol[]>(initialSymbols)
  const [newSymbol, setNewSymbol] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleAddSymbol = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newSymbol.trim()) return
    
    try {
      setIsSubmitting(true)
      const result = await addSymbol(newSymbol.trim().toUpperCase())
      
      if (result) {
        // Update local state
        setSymbols([...symbols, { name: newSymbol.trim().toUpperCase(), trades: 0 }])
        setNewSymbol('')
        toast.success('Symbol added successfully')
      } else {
        toast.error('Symbol already exists')
      }
    } catch (error) {
      toast.error('Failed to add symbol')
      console.error(error)
    } finally {
      setIsSubmitting(false)
      router.refresh() // Refresh page data
    }
  }

  const handleDeleteSymbol = async (symbolName: string) => {
    if (confirm(`Are you sure you want to delete ${symbolName}?`)) {
      try {
        await deleteSymbol(symbolName)
        
        // Update local state
        setSymbols(symbols.filter(s => s.name !== symbolName))
        toast.success('Symbol deleted successfully')
        router.refresh() // Refresh page data
      } catch (error) {
        toast.error('Failed to delete symbol')
        console.error(error)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Manage Symbols</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddSymbol} className="flex items-center gap-2 mb-4">
          <Input 
            placeholder="Add new symbol (e.g., EURUSD)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="uppercase"
          />
          <Button 
            type="submit" 
            size="sm"
            disabled={!newSymbol.trim() || isSubmitting}
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Add
          </Button>
        </form>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {symbols.map((symbol) => (
            <Badge 
              key={symbol.name} 
              variant="outline" 
              className="py-2 px-3 flex items-center gap-2 cursor-default"
            >
              {symbol.name}
              {symbol.trades !== undefined && (
                <span className="text-xs text-muted-foreground">({symbol.trades})</span>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-2 text-muted-foreground hover:text-red-500"
                onClick={() => handleDeleteSymbol(symbol.name)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {symbols.length === 0 && (
            <p className="text-sm text-muted-foreground">No symbols added yet. Add your first trading symbol above.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 