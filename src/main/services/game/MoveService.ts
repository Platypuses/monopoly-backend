import GameStateDto from '../../models/responses/game/state/GameStateDto';
import GameCellDto from '../../models/responses/game/state/GameCellDto';
import PlayerOnVacantPropertyEventDispatcher from './dispatchers/PlayerOnVacantPropertyEventDispatcher';
import PlayerPurchaseOfferEventDispatcher from './dispatchers/PlayerPurchaseOfferEventDispatcher';
import PlayerBalanceChangeEventDispatcher from './dispatchers/PlayerBalanceChangeEventDispatcher';
import PlayerOnTaxCellEventDispatcher from './dispatchers/PlayerOnTaxCellEventDispatcher';

const TAX = 100;
const TAX_DESCRIPTION = 'Заплати налог!';

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

  PlayerBalanceChangeEventDispatcher.dispatchEvent(
    gameState,
    gameState.currentMovePlayerId,
    cell.rent
  );

  PlayerBalanceChangeEventDispatcher.dispatchEvent(
    gameState,
    cell.ownerId,
    cell.rent
  );
}

export default {
  moveToPropertyCell(gameState: GameStateDto, cell: GameCellDto): void {
    if (cell.ownerId == null) {
      offerToByProperty(gameState, cell);
    } else {
      payRent(gameState, cell);
    }
  },
  moveToChanceCell(gameState: GameStateDto, cell: GameCellDto): void {},

  moveToTaxCell(gameState: GameStateDto, cell: GameCellDto): void {
    PlayerOnTaxCellEventDispatcher.dispatchEvent(
      gameState,
      gameState.currentMovePlayerId,
      cell.cellId,
      TAX_DESCRIPTION
    );

    PlayerBalanceChangeEventDispatcher.dispatchEvent(
      gameState,
      gameState.currentMovePlayerId,
      TAX
    );
  },
};
