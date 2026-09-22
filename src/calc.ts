export function randomBits(alphabetLength: number, idLength: number): number {
  return idLength * (Math.log(alphabetLength) / Math.LN2);
}

export function criticalNumber(randomBits: number, probability: number): number {
  return Math.sqrt(2 * Math.pow(2, randomBits) * Math.log(1 / (1 - probability)));
}

export function timeToCollision(criticalNumber: number, speed: number): number {
  return Math.floor(criticalNumber / speed);
}
