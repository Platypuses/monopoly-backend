import PlayerDto from './PlayerDto';
import GameCellDto from './GameCellDto';

export default interface GameStateDto {
  gameId: number;
  players: PlayerDto[];
  cells: GameCellDto[];
  currentMovePlayerId: number;
}
