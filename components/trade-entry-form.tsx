"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle } from 'lucide-react'

export default function TradeEntryForm() {
  const [formData, setFormData] = useState({
    symbol: '',
    lotSize: '',
    action: '',
    profitLoss: '',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Trade submitted:', formData)
    // Reset form
    setFormData({
      symbol: '',
      lotSize: '',
      action: '',
      profitLoss: '',
      notes: ''
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="sticky top-20 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Add New Trade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol *</Label>
            <Input
              id="symbol"
              placeholder="e.g., EURUSD"
              value={formData.symbol}
              onChange={(e) => handleInputChange('symbol', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lotSize">Lot Size</Label>
            <Input
              id="lotSize"
              type="number"
              step="0.01"
              placeholder="e.g., 0.10"
              value={formData.lotSize}
              onChange={(e) => handleInputChange('lotSize', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select value={formData.action} onValueChange={(value) => handleInputChange('action', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profitLoss">Profit/Loss ($)</Label>
            <Input
              id="profitLoss"
              type="number"
              step="0.01"
              placeholder="e.g., 125.50"
              value={formData.profitLoss}
              onChange={(e) => handleInputChange('profitLoss', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Trade notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Add Trade
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}