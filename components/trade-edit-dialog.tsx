"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Trade, updateTrade, Symbol } from "@/lib/redis-schema"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface TradeEditDialogProps {
  isOpen: boolean
  onClose: () => void
  trade: Trade | null
  symbols: Symbol[]
}

export function TradeEditDialog({ isOpen, onClose, trade, symbols }: TradeEditDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Trade>({
    id: "",
    date: "",
    symbol: "",
    action: "buy",
    size: 0,
    pnl: 0,
    notes: ""
  })

  // Update form data when trade changes
  useEffect(() => {
    if (trade) {
      setFormData(trade)
    }
  }, [trade])

  const handleInputChange = (field: keyof Trade, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.symbol || !formData.date) {
      toast.error('Please fill in all required fields')
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Ensure proper types
      const updatedTrade: Trade = {
        ...formData,
        size: parseFloat(String(formData.size)),
        pnl: parseFloat(String(formData.pnl))
      }
      
      const result = await updateTrade(updatedTrade)
      
      if (result) {
        toast.success('Trade updated successfully')
        onClose()
        router.refresh()
      } else {
        toast.error('Failed to update trade')
      }
    } catch (error) {
      toast.error('An error occurred while updating the trade')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const setAction = (action: 'buy' | 'sell') => {
    setFormData(prev => ({
      ...prev,
      action: action
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Trade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="symbol">Symbol *</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {symbols.map((symbol) => (
                  <Button
                    key={symbol.name}
                    type="button"
                    size="sm"
                    variant={formData.symbol === symbol.name ? "default" : "outline"}
                    onClick={() => handleInputChange('symbol', symbol.name)}
                    className="flex-grow-0"
                  >
                    {symbol.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="action">Action *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  onClick={() => setAction('buy')}
                  className={cn(
                    "w-full h-10 text-white",
                    formData.action === 'buy' ? "bg-green-600 hover:bg-green-700" : "bg-green-600/70 hover:bg-green-600"
                  )}
                >
                  BUY
                </Button>
                <Button
                  type="button"
                  onClick={() => setAction('sell')}
                  className={cn(
                    "w-full h-10 text-white",
                    formData.action === 'sell' ? "bg-red-600 hover:bg-red-700" : "bg-red-600/70 hover:bg-red-600"
                  )}
                >
                  SELL
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="size">Lot Size *</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                <Button 
                  type="button" 
                  size="sm" 
                  variant={formData.size === 0.005 ? "default" : "outline"}
                  onClick={() => handleInputChange("size", 0.005)}
                >
                  0.005
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant={formData.size === 0.01 ? "default" : "outline"}
                  onClick={() => handleInputChange("size", 0.01)}
                >
                  0.01
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant={formData.size === 0.05 ? "default" : "outline"}
                  onClick={() => handleInputChange("size", 0.05)}
                >
                  0.05
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant={formData.size === 0.1 ? "default" : "outline"}
                  onClick={() => handleInputChange("size", 0.1)}
                >
                  0.1
                </Button>
              </div>
              <Input
                id="size"
                type="number"
                step="0.001"
                placeholder="Custom lot size"
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pnl">Profit/Loss ($)</Label>
              <Input
                id="pnl"
                type="number"
                step="0.01"
                placeholder="e.g., 125.50"
                value={formData.pnl}
                onChange={(e) => handleInputChange("pnl", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Trade notes..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 