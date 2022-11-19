import { Combination } from "./game-manager";
import { CellCoordinate } from "./game-enums";

export const POSSIBLE_COMBINATIONS: Combination[] = [
  [CellCoordinate.TopLeft, CellCoordinate.TopCenter, CellCoordinate.TopRight],
  [
    CellCoordinate.MiddleLeft,
    CellCoordinate.MiddleCenter,
    CellCoordinate.MiddleRight,
  ],
  [
    CellCoordinate.BottomLeft,
    CellCoordinate.BottomCenter,
    CellCoordinate.BottomRight,
  ],
  [
    CellCoordinate.TopLeft,
    CellCoordinate.MiddleLeft,
    CellCoordinate.BottomLeft,
  ],
  [
    CellCoordinate.TopCenter,
    CellCoordinate.MiddleCenter,
    CellCoordinate.BottomCenter,
  ],
  [
    CellCoordinate.TopRight,
    CellCoordinate.MiddleRight,
    CellCoordinate.BottomRight,
  ],
  [
    CellCoordinate.TopLeft,
    CellCoordinate.MiddleCenter,
    CellCoordinate.BottomRight,
  ],
  [
    CellCoordinate.TopRight,
    CellCoordinate.MiddleCenter,
    CellCoordinate.BottomLeft,
  ],
];
