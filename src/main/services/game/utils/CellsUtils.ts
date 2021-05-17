import GameCellDto from '../../../models/responses/game/state/GameCellDto';
import CellType from '../../../models/enums/CellType';

export default {
  initCellsList(): GameCellDto[] {
    let id = 1;
    return [
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.START,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'CHANNEL',
        price: 60,
        rent: 2,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.CHANCE,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'BOSS',
        price: 60,
        rent: 4,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.TAX,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'MERCEDES',
        price: 200,
        rent: 50,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'ADIDAS',
        price: 100,
        rent: 6,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.CHANCE,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'PUMA',
        price: 100,
        rent: 6,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'LACOSTE',
        price: 120,
        rent: 8,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.CORNER,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'VK',
        price: 140,
        rent: 10,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'ROCKSTAR',
        price: 150,
        rent: 20,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'FACEBOOK',
        price: 140,
        rent: 10,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'TWITTER',
        price: 160,
        rent: 12,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'AUDI',
        price: 200,
        rent: 50,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'COCA-COLA',
        price: 180,
        rent: 14,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.CHANCE,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'PEPSI',
        price: 180,
        rent: 14,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'FANTA',
        price: 200,
        rent: 16,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.CORNER,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'AMERICAN AIRLINES',
        price: 220,
        rent: 18,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.CHANCE,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'LUFTHANSA',
        price: 220,
        rent: 18,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'BRITISH AIRLINES',
        price: 240,
        rent: 20,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'FORD',
        price: 200,
        rent: 50,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'MCDONALDS',
        price: 260,
        rent: 22,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'BURGER KING',
        price: 260,
        rent: 22,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'ROVIO',
        price: 150,
        rent: 20,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'KFC',
        price: 280,
        rent: 24,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.CORNER,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'HOLIDAY INN',
        price: 300,
        rent: 26,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'RADISSON',
        price: 300,
        rent: 26,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.CHANCE,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'NOVOTEL',
        price: 320,
        rent: 28,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'LAND ROVER',
        price: 200,
        rent: 50,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.TAX,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'APPLE',
        price: 350,
        rent: 35,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.CHANCE,
      },
      {
        cellId: id++,
        ownerId: null,
        cellType: CellType.PROPERTY,
        name: 'NOKIA',
        price: 400,
        rent: 50,
      },
    ];
  },
};
