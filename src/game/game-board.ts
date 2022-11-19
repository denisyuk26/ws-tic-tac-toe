import { CellCoordinate, CellValue } from "./game-enums";

export type Board = Record<CellCoordinate, CellValue>;

export class GameBoard {
  public board: Board;
  constructor(board: Board) {
    this.board = board;
  }

  public updateBoard(board: Board) {
    this.board = board;
    return this;
  }
}
