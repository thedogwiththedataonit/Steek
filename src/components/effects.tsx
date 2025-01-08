"use client"

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { Fragment } from 'react'

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
          origin: { y: 0.6 },
          colors: ['#00ff00', '#4caf50', '#45a049']
        })
      } else if (result === "lose") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff0000', '#ff3333', '#ff6666']
        })
      }
      setPlayed(true)
    }
  }, [result, played])

  return null
}

interface MultiEffectsProps {
  results: ("win" | "lose" | "push" | null)[]
}

export function MultiEffects({ results }: MultiEffectsProps) {
  return (
    <Fragment>
      {results.map((result, index) => (
        <Effects key={index} result={result} />
      ))}
    </Fragment>
  )
}


