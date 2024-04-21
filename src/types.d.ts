type Points = 1 | 2 | 3 | 4 | 5

interface Vector2 {
  x: number;
  y: number;
}

interface Emotion {
  id: number;
  name: string;
  colour: string;
  power: Points;
  defence: Points;
  frquency: Points;
  growth: Points;
  realPower: number;
  realDefence: number;
  realFrequency: number;
  realGrowth: number;
}

interface getSet<T> {
  get: () => T;
  set: (v: T) => void;
}

interface CellType {
  id: number;
  pos: Vector2;
  emotion: Emotion | null;
  immune: number;
  links: {
    cell: CellType;
    rendered: boolean;
  }[]
  render(ctx: CanvasRenderingContext2D, globalPos: Vector2): void;
  link(cell: CellType): void;
}

interface AttackedCell {
  cell: CellType;
  damageDealt: {
    by: Emotion;
    amount: number;
  }[]
}

interface TicksLeft {
  num: number;
  emotion: Emotion;
}

interface EmotionStats {
  num: number;
  emotion: Emotion;
}