"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ClipboardList } from 'lucide-react'

interface BetHistoryEntry {
  amount: number
  time: string
  result: "win" | "lose" | "push"
  balance: number
}

interface BetHistoryProps {
  history: BetHistoryEntry[]
}

export function BetHistory({ history }: BetHistoryProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-slate-900 hover:text-slate-200">
          <ClipboardList className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px] bg-slate-800 text-white border-l border-slate-700">
        <SheetHeader>
          <SheetTitle className="text-white">Bet History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          {history.map((entry, index) => (
            <div
              key={index}
              className={`mb-2 p-2 text-sm rounded ${
                entry.result === 'win'
                  ? 'text-green-500 border border-green-500'
                  : entry.result === 'lose'
                  ? 'text-red-500 border border-red-500'
                  : 'text-yellow-500 border border-yellow-500'
              }`}
            >
              <p>Amount: ${entry.amount.toFixed(2)}</p>
              <p>Time: {entry.time}</p>
              <p>Result: {entry.result}</p>
              <p>Balance: ${entry.balance.toFixed(2)}</p>
            </div>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

