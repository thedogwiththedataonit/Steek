export type Suit = '♠' | '♣' | '♥' | '♦'
export type Value = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  suit: Suit
  value: Value
  hidden?: boolean
}

export function createDeck(): Card[] {
  const suits: Suit[] = ['♠', '♣', '♥', '♦']
  const values: Value[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const deck: Card[] = []

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value })
    }
  }

  return shuffle(deck)
}

export function shuffle(deck: Card[]): Card[] {
  const newDeck = [...deck]
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
  }
  return newDeck
}

export function calculateHand(cards: Card[]): number {
  let total = 0
  let aces = 0

  for (const card of cards) {
    if (card.hidden) continue
    
    if (card.value === 'A') {
      aces += 1
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      total += 10
    } else {
      total += parseInt(card.value)
    }
  }

  // Add aces
  for (let i = 0; i < aces; i++) {
    if (total + 11 <= 21) {
      total += 11
    } else {
      total += 1
    }
  }

  return total
}

export function isBlackjack(hand: Card[]): boolean {
  return hand.length === 2 && calculateHand(hand) === 21
}

export function canSplit(hand: Card[]): boolean {
  return hand.length === 2 && hand[0].value === hand[1].value
}

export function formatHandValue(hand: Card[]): string {
  const value = calculateHand(hand)
  return `${value}`
}

export function isBust(hand: Card[]): boolean {
  return calculateHand(hand) > 21
}

export function shouldDealerHit(hand: Card[]): boolean {
  return calculateHand(hand) < 17
}

