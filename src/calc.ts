// UUID v4 has 128 bits in total, of which 4 version bits and 2 variant bits
// are fixed, leaving 122 bits of actual randomness.
export const UUID_RANDOM_BITS = 122;

// IDs within this many bits of UUID entropy are treated as similar.
export const UUID_RANDOM_BITS_TOLERANCE = 4;

export function randomBits(alphabetLength: number, idLength: number): number {
  return idLength * (Math.log(alphabetLength) / Math.LN2);
}

export function criticalNumber(randomBits: number, probability: number): number {
  return Math.sqrt(2 * Math.pow(2, randomBits) * Math.log(1 / (1 - probability)));
}

export function timeToCollision(criticalNumber: number, speed: number): number {
  return Math.floor(criticalNumber / speed);
}
