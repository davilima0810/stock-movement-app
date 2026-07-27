export type MovementType = 'ENTRY' | 'EXIT';

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  ENTRY: 'Entrada',
  EXIT: 'Saída',
};

export interface StockMovement {
  id: number;
  productId: number;
  productCode: string;
  movementType: MovementType;
  salePrice: number;
  quantity: number;
  movementDate: string;
}

export interface CreateStockMovementData {
  productId: number;
  movementType: MovementType;
  salePrice: number;
  quantity: number;
}
