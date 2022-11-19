import { PlayerSymbol } from "../room/room";
import { GameBoard } from "./game-board";
import { CellCoordinate, CellValue, GameStatus } from "./game-enums";
import { POSSIBLE_COMBINATIONS } from "./possible-combinations";

export type Combination = [CellCoordinate, CellCoordinate, CellCoordinate];

export class GameManager {
  public gameBoard: GameBoard;
  constructor() {
    this.gameBoard = new GameBoard({
      [CellCoordinate.TopLeft]: CellValue.Empty,
      [CellCoordinate.TopCenter]: CellValue.Empty,
      [CellCoordinate.TopRight]: CellValue.Empty,
      [CellCoordinate.MiddleLeft]: CellValue.Empty,
      [CellCoordinate.MiddleCenter]: CellValue.Empty,
      [CellCoordinate.MiddleRight]: CellValue.Empty,
      [CellCoordinate.BottomLeft]: CellValue.Empty,
      [CellCoordinate.BottomCenter]: CellValue.Empty,
      [CellCoordinate.BottomRight]: CellValue.Empty,
    });
  }

  public makeMove(coordinate: CellCoordinate, player: PlayerSymbol) {
    if (this.gameStatus !== GameStatus.Running) {
      return;
    }

    if (coordinate < 0 || coordinate > 8) {
      throw new TypeError("Invalid coordinate");
    }

    const board = this.gameBoard.board;

    if (board[coordinate] !== CellValue.Empty) {
      return;
    }

    const nextBoard = {
      ...board,
      [coordinate]: player,
    };

    this.gameBoard = this.gameBoard.updateBoard(nextBoard);
  }

  public get board() {
    return this.gameBoard.board;
  }

  public restartGame() {
    this.gameBoard = new GameBoard({
      [CellCoordinate.TopLeft]: CellValue.Empty,
      [CellCoordinate.TopCenter]: CellValue.Empty,
      [CellCoordinate.TopRight]: CellValue.Empty,
      [CellCoordinate.MiddleLeft]: CellValue.Empty,
      [CellCoordinate.MiddleCenter]: CellValue.Empty,
      [CellCoordinate.MiddleRight]: CellValue.Empty,
      [CellCoordinate.BottomLeft]: CellValue.Empty,
      [CellCoordinate.BottomCenter]: CellValue.Empty,
      [CellCoordinate.BottomRight]: CellValue.Empty,
    });
  }

  private isWinCombination(combination: Combination): boolean {
    const [first, second, third] = combination;
    const firstValue = this.gameBoard.board[first];
    const secondValue = this.gameBoard.board[second];
    const thirdValue = this.gameBoard.board[third];

    return (
      firstValue !== CellValue.Empty &&
      firstValue === secondValue &&
      secondValue === thirdValue
    );
  }

  private isCombinationClosed(combination: Combination): boolean {
    return combination.every(
      (coordinate) => this.gameBoard.board[coordinate] !== CellValue.Empty
    );
  }

  public get gameStatus(): GameStatus {
    const closedCombinations = POSSIBLE_COMBINATIONS.filter((combination) =>
      this.isCombinationClosed(combination)
    );

    if (closedCombinations.length === 0) {
      return GameStatus.Running;
    }

    const winCombination = closedCombinations.find((combination) =>
      this.isWinCombination(combination)
    );

    if (winCombination) {
      return GameStatus.Win;
    }

    if (closedCombinations.length === POSSIBLE_COMBINATIONS.length) {
      return GameStatus.Draw;
    }

    return GameStatus.Running;
  }

  public get gameWinCombination(): Combination | undefined {
    const closedCombinations = POSSIBLE_COMBINATIONS.filter((combination) =>
      this.isCombinationClosed(combination)
    );

    if (closedCombinations.length === 0) {
      return;
    }

    const winCombination = closedCombinations.find((combination) =>
      this.isWinCombination(combination)
    );

    if (winCombination) {
      return winCombination;
    }

    if (closedCombinations.length === POSSIBLE_COMBINATIONS.length) {
      return;
    }

    return;
  }
}
