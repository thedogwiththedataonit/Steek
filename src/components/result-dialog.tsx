"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ResultDialogProps {
  open: boolean
  onClose: () => void
  result: "win" | "lose" | "push" | null
}

export function ResultDialog({ open, onClose, result }: ResultDialogProps) {
  const messages = {
    win: "You won!",
    lose: "You lost",
    push: "It's a push!",
  }

  const colors = {
    win: "text-green-500",
    lose: "text-red-500",
    push: "text-yellow-500",
  }

  if (!result) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className={`text-center text-2xl ${colors[result]}`}>
            {messages[result]}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white">
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

