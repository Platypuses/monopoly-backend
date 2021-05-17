import GameStateDto from '../../models/responses/game/state/GameStateDto';
import GameCellDto from '../../models/responses/game/state/GameCellDto';
import PlayerOnVacantPropertyEventDispatcher from './dispatchers/PlayerOnVacantPropertyEventDispatcher';
import PlayerPurchaseOfferEventDispatcher from './dispatchers/PlayerPurchaseOfferEventDispatcher';
import PlayerBalanceChangeEventDispatcher from './dispatchers/PlayerBalanceChangeEventDispatcher';
import PlayerOnTaxCellEventDispatcher from './dispatchers/PlayerOnTaxCellEventDispatcher';
import ChanceService from './ChanceService';
import PlayerOnChanceCellEventDispatcher from './dispatchers/PlayerOnChanceCellEventDispatcher';
import GameLoopService from './GameLoopService';

const TAX_AMOUNT = 100;
const TAX_DESCRIPTION = 'Заплати налог!';

/* eslint-disable no-param-reassign */

function offerToByProperty(gameState: GameStateDto, cell: GameCellDto) {
  PlayerOnVacantPropertyEventDispatcher.dispatchEvent(
    gameState,
    gameState.currentMovePlayerId,
    cell.cellId
  );

  PlayerPurchaseOfferEventDispatcher.dispatchEvent(
    gameState.currentMovePlayerId,
    cell.cellId
  );
}

function payRent(gameState: GameStateDto, cell: GameCellDto) {
  if (cell.ownerId == null) {
    return;
  }

  if (cell.rent == null) {
    return;
  }

  GameLoopService.getCurrentPlayer(gameState).balance -= cell.rent;
  PlayerBalanceChangeEventDispatcher.dispatchEvent(
    gameState,
    gameState.currentMovePlayerId,
    -cell.rent
  );

  GameLoopService.getPlayerById(gameState, cell.ownerId).balance += cell.rent;
  PlayerBalanceChangeEventDispatcher.dispatchEvent(
    gameState,
    cell.ownerId,
    cell.rent
  );
}

export default {
  moveToPropertyCell(gameState: GameStateDto, cell: GameCellDto): boolean {
    let isEndOfTurn: boolean;

    if (cell.ownerId == null) {
      offerToByProperty(gameState, cell);
      isEndOfTurn = false;
    } else {
      payRent(gameState, cell);
      isEndOfTurn = true;
    }

    return isEndOfTurn;
  },

  moveToChanceCell(gameState: GameStateDto, cell: GameCellDto): void {
    const chance = ChanceService.getChance();

    PlayerOnChanceCellEventDispatcher.dispatchEvent(
      gameState,
      gameState.currentMovePlayerId,
      cell.cellId,
      chance.text
    );

    GameLoopService.getCurrentPlayer(gameState).balance += chance.cost;
    PlayerBalanceChangeEventDispatcher.dispatchEvent(
      gameState,
      gameState.currentMovePlayerId,
      chance.cost
    );
  },

  moveToTaxCell(gameState: GameStateDto, cell: GameCellDto): void {
    PlayerOnTaxCellEventDispatcher.dispatchEvent(
      gameState,
      gameState.currentMovePlayerId,
      cell.cellId,
      TAX_DESCRIPTION
    );

    GameLoopService.getCurrentPlayer(gameState).balance -= TAX_AMOUNT;
    PlayerBalanceChangeEventDispatcher.dispatchEvent(
      gameState,
      gameState.currentMovePlayerId,
      -TAX_AMOUNT
    );
  },
};
