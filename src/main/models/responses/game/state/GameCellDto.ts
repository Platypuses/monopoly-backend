import CellType from '../../../enums/CellType';

export default interface GameCellDto {
  cellId: number;
  ownerId: number | null;
  cellType: CellType;
  name?: string;
  price?: number | null;
  rent?: number | null;
  description?: string;
}
