"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from 'lucide-react'

interface GameControlsProps {
  betAmount: number
  setBetAmount: (amount: number) => void
  onHit: () => void
  onStand: () => void
  onBet: () => void
  onSplit: () => void
  onDouble: () => void
  onSurrender: () => void
  canHit: boolean
  canStand: boolean
  canSplit: boolean
  canDouble: boolean
  canSurrender: boolean
  gameStarted: boolean
  gameOver: boolean
  wallet: number
}

export function GameControls({
  betAmount,
  setBetAmount,
  onHit,
  onStand,
  onBet,
  onSplit,
  onDouble,
  onSurrender,
  canHit,
  canStand,
  canSplit,
  canDouble,
  canSurrender,
  gameStarted,
  gameOver,
  wallet
}: GameControlsProps) {
  const isBroke = wallet <= 0

  return (
    <div className="bg-slate-800/50 p-4 sm:p-6 rounded-lg space-y-4 w-full sm:w-[300px]">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Bet Amount</span>
          <span className="text-gray-400 hover:text-gray-300">
            <X className="h-4 w-4" />
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.min(Number(e.target.value), wallet))}
            className="bg-slate-900 border-slate-700 w-full sm:w-auto"
            min={0}
            max={wallet}
            step={0.01}
            disabled={gameStarted || isBroke}
          />
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBetAmount(Math.floor(betAmount / 2))}
              className="flex-1 text-gray-600 hover:text-gray-800"
              disabled={gameStarted || isBroke}
            >
              ½
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBetAmount(Math.min(betAmount * 2, wallet))}
              className="flex-1 text-gray-600 hover:text-gray-800"
              disabled={gameStarted || isBroke}
            >
              2×
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBetAmount(wallet)}
              className="flex-1 text-gray-600 hover:text-gray-800"
              disabled={gameStarted || isBroke}
            >
              MAX
            </Button>
          </div>
        </div>
        {isBroke && (
          <p className="text-red-500 text-sm">Lmao u broke</p>
        )}
      </div>

      {gameStarted && !gameOver ? (
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={onHit}
            disabled={!canHit}
          >
            Hit
          </Button>
          <Button
            variant="default"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={onStand}
            disabled={!canStand}
          >
            Stand
          </Button>
          <Button
            variant="outline"
            className="text-gray-600 hover:text-gray-800"
            onClick={onSplit}
            disabled={!canSplit}
          >
            Split
          </Button>
          <Button
            variant="outline"
            className="text-gray-600 hover:text-gray-800"
            onClick={onDouble}
            disabled={!canDouble}
          >
            Double
          </Button>
          <Button
            variant="outline"
            className="text-gray-600 hover:text-gray-800 col-span-2"
            onClick={onSurrender}
            disabled={!canSurrender}
          >
            Surrender
          </Button>
        </div>
      ) : !gameStarted ? (
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          onClick={onBet}
          disabled={betAmount <= 0 || betAmount > wallet || isBroke}
        >
          Bet
        </Button>
      ) : null}
    </div>
  )
}

