export enum GameStatus {
  Win = "win",
  Draw = "draw",
  Running = "running",
}

export enum Player {
  Cross = "x",
  Circle = "o",
}

export enum CellCoordinate {
  TopLeft = 0,
  TopCenter = 1,
  TopRight = 2,
  MiddleLeft = 3,
  MiddleCenter = 4,
  MiddleRight = 5,
  BottomLeft = 6,
  BottomCenter = 7,
  BottomRight = 8,
}

export enum CellValue {
  Empty = "",
  Cross = "x",
  Circle = "o",
}
