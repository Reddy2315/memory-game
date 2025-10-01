export interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

export interface Level {
  pairs: number; // number of pairs for the level
  time: number;  // seconds
}
