"use client"

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

interface EffectsProps {
  result: "win" | "lose" | "push" | null
}

export function Effects({ result }: EffectsProps) {
  const [played, setPlayed] = useState(false)

  useEffect(() => {
    if (result && !played) {
      if (result === "win") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      } else if (result === "lose") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff0000', '#ff3333', '#ff6666'],
          shapes: ['circle'],
          gravity: 1.5,
          scalar: 1.2,
          ticks: 50
        })
      }
      setPlayed(true)
    }
  }, [result, played])

  return null
}

