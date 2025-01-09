"use client"

import { useState, useEffect, useRef } from "react"
import { createDeck, calculateHand, Card, isBlackjack, canSplit, formatHandValue, isBust, shouldDealerHit } from "../utils/cards"
import { PlayingCard } from "./playing-card"
import { GameControls } from "./game-controls"
import { BetHistory } from "./bet-history"
import { Bell, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { MultiEffects } from "./effects"

interface BetHistoryEntry {
  amount: number
  time: string
  result: "win" | "lose" | "push"
  balance: number
}

export default function BlackjackGame() {
  const [deck, setDeck] = useState<Card[]>([])
  const [playerHands, setPlayerHands] = useState<Card[][]>([[]])
  const [dealerHand, setDealerHand] = useState<Card[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [result, setResult] = useState<("win" | "lose" | "push")[]>([])
  const [wallet, setWallet] = useState(1000)
  const [betAmount, setBetAmount] = useState(100)
  const [currentBets, setCurrentBets] = useState<number[]>([])
  const [canSplitHand, setCanSplitHand] = useState(false)
  const [canDoubleDown, setCanDoubleDown] = useState(false)
  const [canSurrender, setCanSurrender] = useState(false)
  const [betHistory, setBetHistory] = useState<BetHistoryEntry[]>([])
  const [currentHandIndex, setCurrentHandIndex] = useState(0)
  const [insurance, setInsurance] = useState(0)
  const [internalBalance, setInternalBalance] = useState(0)
  const finalDealerHandRef = useRef<Card[]>([])

  useEffect(() => {
    setDeck(createDeck())
  }, [])

  const dealInitialCards = () => {
    const actualBet = Math.min(betAmount, wallet)
    const newDeck = [...deck]
    const playerCards = [newDeck.pop()!, newDeck.pop()!]
    const dealerCards = [newDeck.pop()!, { ...newDeck.pop()!, hidden: true }]
    
    setPlayerHands([playerCards])
    setDealerHand(dealerCards)
    finalDealerHandRef.current = dealerCards
    setDeck(newDeck)
    setGameStarted(true)
    setCurrentBets([actualBet])
    setWallet(wallet - actualBet)

    setCanSplitHand(canSplit(playerCards))
    setCanDoubleDown(wallet >= actualBet)
    setCanSurrender(true)

    if (dealerCards[0].value === 'A') {
      offerInsurance()
    }

    if (isBlackjack(playerCards) || isBlackjack(dealerCards)) {
      endGame()
    }
  }

  const offerInsurance = () => {
    // Implement insurance logic here
    console.log( "Insurance offered: ", insurance)
  }

  const hit = () => {
    const newDeck = [...deck]
    const newCard = newDeck.pop()!
    const newHands = [...playerHands]
    newHands[currentHandIndex] = [...newHands[currentHandIndex], newCard]
    setPlayerHands(newHands)
    setDeck(newDeck)
    setCanDoubleDown(false)
    setCanSurrender(false)

    const handValue = calculateHand(newHands[currentHandIndex])
    if (handValue > 21) {
      handlePlayerBust()
    } else if (handValue === 21) {
      if (currentHandIndex < playerHands.length - 1) {
        setCurrentHandIndex(currentHandIndex + 1)
      } else {
        stand()
      }
    } else if (currentHandIndex < playerHands.length - 1) {
      setCurrentHandIndex(currentHandIndex + 1)
    }
  }

  const handlePlayerBust = () => {
    const newResults = [...result]
    newResults[currentHandIndex] = "lose"
    setResult(newResults)
    setInternalBalance(prev => prev + currentBets[currentHandIndex])
    
    if (currentHandIndex < playerHands.length - 1) {
      setCurrentHandIndex(currentHandIndex + 1)
    } else {
      endGame(newResults)
    }
  }

  const stand = () => {
    if (currentHandIndex < playerHands.length - 1) {
      setCurrentHandIndex(currentHandIndex + 1)
    } else {
      dealerTurn()
    }
  }

  const dealerTurn = async () => {
    let currentDealerHand = dealerHand.map(card => ({ ...card, hidden: false }))
    setDealerHand(currentDealerHand)
    finalDealerHandRef.current = currentDealerHand

    const newDeck = [...deck]

    while (shouldDealerHit(currentDealerHand)) {
      const newCard = { ...newDeck.pop()!, hidden: false }
      currentDealerHand = [...currentDealerHand, newCard]
      setDealerHand(currentDealerHand)
      finalDealerHandRef.current = currentDealerHand
      setDeck(newDeck)
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    endGame()
  }

  const split = () => {
    if (canSplitHand && wallet >= currentBets[0]) {
      const newHands = [
        [playerHands[0][0]],
        [playerHands[0][1]]
      ]
      setPlayerHands(newHands)
      setCanSplitHand(false)
      setCurrentBets([...currentBets, currentBets[0]])
      setWallet(wallet - currentBets[0])

      // Deal one card to each new hand
      const newDeck = [...deck]
      newHands[0].push(newDeck.pop()!)
      newHands[1].push(newDeck.pop()!)
      setPlayerHands(newHands)
      setDeck(newDeck)
    }
  }

  const doubleDown = () => {
    if (canDoubleDown && wallet >= currentBets[currentHandIndex]) {
      const newDeck = [...deck]
      const newCard = newDeck.pop()!
      const newHands = [...playerHands]
      newHands[currentHandIndex] = [...newHands[currentHandIndex], newCard]
      setPlayerHands(newHands)
      setDeck(newDeck)
      setWallet(wallet - currentBets[currentHandIndex])
      const newBets = [...currentBets]
      newBets[currentHandIndex] *= 2
      setCurrentBets(newBets)
      setCanDoubleDown(false)
      setCanSurrender(false)

      const handValue = calculateHand(newHands[currentHandIndex])
      if (handValue > 21) {
        handlePlayerBust()
      } else if (currentHandIndex < playerHands.length - 1) {
        setCurrentHandIndex(currentHandIndex + 1)
      } else {
        dealerTurn()
      }
    }
  }

  const surrender = () => {
    if (canSurrender) {
      setWallet(wallet + currentBets[0] / 2)
      setInternalBalance(internalBalance + currentBets[0] / 2)
      endGame(["lose"])
    }
  }

  const endGame = (forcedResults: ("win" | "lose" | "push")[] | null = null) => {
    let results: ("win" | "lose" | "push")[]

    if (forcedResults) {
      results = forcedResults
    } else {
      results = playerHands.map((hand, index) => {
        if (result[index] === "lose") return "lose" // Keep existing lose results (from busts)
        
        const playerScore = calculateHand(hand)
        const dealerScore = calculateHand(finalDealerHandRef.current)
        const dealerBusted = isBust(finalDealerHandRef.current)

        if (isBlackjack(hand)) return dealerScore === 21 ? "push" : "win"
        if (dealerBusted) return "win"
        
        if (playerScore > dealerScore) return "win"
        if (playerScore === dealerScore) return "push"
        return "lose"
      })
    }

    setResult(results)
    setGameOver(true)
    updateWallet(results)

    // Reveal dealer's cards
    setDealerHand(finalDealerHandRef.current.map(card => ({ ...card, hidden: false })))

    // Update bet history
    setBetHistory(prev => [
      ...results.map((result, index) => ({
        amount: currentBets[index],
        time: new Date().toLocaleTimeString(),
        result,
        balance: wallet
      })),
      ...prev
    ])
  }

  const updateWallet = (results: ("win" | "lose" | "push")[]) => {
    let walletChange = 0
    results.forEach((result, index) => {
      if (result === "win") {
        if (isBlackjack(playerHands[index])) {
          walletChange += currentBets[index] * 2.5
        } else {
          walletChange += currentBets[index] * 2
        }
      } else if (result === "push") {
        walletChange += currentBets[index]
      }
      // "lose" case is already handled in handlePlayerBust
    })
    setWallet(prev => prev + walletChange)
  }

  const resetGame = () => {
    setDeck(createDeck())
    setPlayerHands([[]])
    setDealerHand([])
    finalDealerHandRef.current = []
    setGameStarted(false)
    setGameOver(false)
    setResult([])
    setCanSplitHand(false)
    setCanDoubleDown(false)
    setCanSurrender(false)
    setCurrentBets([])
    setCurrentHandIndex(0)
    setInsurance(0)
  }

  const getScoreColor = (hand: Card[], isDealer: boolean, handIndex: number = 0) => {
    if (!gameOver && !isBust(hand)) return "bg-slate-700 text-white"
    if (isDealer) {
      return playerHands.some(h => isBust(h)) || result.every(r => r === "lose") ? "bg-green-600 text-white" : 
           isBust(hand) ? "bg-red-600 text-white" : "bg-slate-700 text-white"
    } else {
      return isBust(hand) || result[handIndex] === "lose" ? "bg-red-600 text-white" :
           result[handIndex] === "win" ? "bg-green-600 text-white" : 
           "bg-yellow-600 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <header className="flex items-center justify-between px-4 py-1 bg-slate-800">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold">Steek</span>
        </div>
        <div className="flex items-center space-x-4 p-1 px-2 rounded-lg border border-yellow-500">
          <span className="text-md tracking-tight font-bold text-yellow-400">${wallet > 0 ? wallet.toFixed(2) : 0}</span>
          <Button size="icon" className="h-8 bg-yellow-500 hover:bg-yellow-500">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <BetHistory history={betHistory} />
          <Bell className="h-6 w-6 text-gray-400" />
        </div>
      </header>

      <main className="flex-grow flex flex-col sm:flex-row justify-between items-center gap-4 p-4 sm:p-8">
        <div className="w-full sm:w-[300px] order-2 sm:order-1">
          <GameControls
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            onHit={hit}
            onStand={stand}
            onBet={dealInitialCards}
            onSplit={split}
            onDouble={doubleDown}
            onSurrender={surrender}
            canHit={gameStarted && !gameOver}
            canStand={gameStarted && !gameOver}
            canSplit={canSplitHand}
            canDouble={canDoubleDown}
            canSurrender={canSurrender}
            gameStarted={gameStarted}
            gameOver={gameOver}
            wallet={wallet}
          />
        </div>
        <div className="flex-grow w-full sm:w-auto h-[500px] sm:h-[600px] order-1 sm:order-2">
          <div className="relative w-full h-full bg-slate-800 rounded-lg overflow-hidden">
            {!gameStarted && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl text-slate-500">Bet to start</span>
              </div>
            )}
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <div className="relative h-2/5 flex items-center justify-center">
                {finalDealerHandRef.current.map((card, index) => (
                  <PlayingCard
                    key={index}
                    card={card}
                    index={index}
                    total={finalDealerHandRef.current.length}
                    isDealer
                    gameResult={gameOver ? (playerHands.some(h => isBust(h)) || result.every(r => r === "lose") ? "win" : "lose") : null}
                  />
                ))}
                {finalDealerHandRef.current.length > 0 && (
                  <div className={`absolute right-0 top-0 px-3 py-1 rounded-full ${getScoreColor(finalDealerHandRef.current, true)}`}>
                    {formatHandValue(finalDealerHandRef.current)}
                    {isBust(finalDealerHandRef.current) && " (Bust)"}
                  </div>
                )}
              </div>
              {gameOver && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                  <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
                    Play Again
                  </Button>
                </div>
              )}
              <div className="relative h-2/5 flex items-center justify-center">
                {playerHands.map((hand, handIndex) => (
                  <div key={handIndex} className="relative flex items-center justify-center">
                    {hand.map((card, index) => (
                      <PlayingCard
                        key={index}
                        card={card}
                        index={index}
                        total={hand.length}
                        gameResult={isBust(hand) || result[handIndex] === "lose" ? "lose" : 
                                    gameOver ? result[handIndex] : null}
                      />
                    ))}
                  </div>
                ))}
                <div className="absolute right-0 top-0 flex flex-col items-end space-y-2">
                  {playerHands.map((hand, handIndex) => (
                    <div
                      key={handIndex}
                      className={`px-3 py-1 rounded-full ${getScoreColor(hand, false, handIndex)}`}
                    >
                      {formatHandValue(hand)}
                      {isBust(hand) && " (Bust)"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MultiEffects results={result} />
    </div>
  )
}