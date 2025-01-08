"use client"

import { motion } from "framer-motion"
import { Card as CardType } from "@/utils/cards"

interface PlayingCardProps {
  card: CardType
  index: number
  total: number
  isDealer?: boolean
  gameResult?: "win" | "lose" | "push" | null
}

export function PlayingCard({ card, index, total, isDealer, gameResult }: PlayingCardProps) {
  const isRed = card.suit === '♥' || card.suit === '♦'

  return (
    <motion.div
      initial={{ 
        scale: 0.5, 
        x: isDealer ? -200 : 200,
        y: isDealer ? -200 : 200,
        rotateY: card.hidden ? 180 : 0 
      }}
      animate={{ 
        scale: 1,
        x: (index - total + 1) * 30,
        y: 0,
        rotateY: card.hidden ? 180 : 0
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: index * 0.1 
      }}
      className={`absolute bg-white rounded-lg w-[120px] h-[180px] flex items-center justify-center shadow-xl ${
        gameResult === "win" ? "border-4 border-green-500" :
        gameResult === "lose" ? "border-4 border-red-500" : ""
      }`}
      style={{ 
        transformStyle: 'preserve-3d',
        zIndex: index,
      }}
    >
      {card.hidden ? (
        <div 
          className="absolute inset-0 bg-gray-400 rounded-lg flex items-center justify-center text-4xl font-bold text-gray-600"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)',
            zIndex: index,
          }}
        >
          ?
        </div>
      ) : (
        <div className={`absolute inset-0 flex flex-col items-center justify-between p-2 ${isRed ? 'text-red-600' : 'text-black'}`}>
          <div className="self-start flex items-center space-x-1">
            <span className="text-xl font-bold">{card.value}</span>
            <span className="text-xl">{card.suit}</span>
          </div>
          <div className="text-6xl">{card.suit}</div>
          <div className="self-end flex items-center space-x-1">
            <span className="text-xl font-bold">{card.value}</span>
            <span className="text-xl">{card.suit}</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

