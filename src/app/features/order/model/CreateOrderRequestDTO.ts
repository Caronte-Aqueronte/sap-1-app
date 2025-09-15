export interface SaveOrderItemDTO {
  menuItemId: string;
  quantity: number;
}

export interface CreateOrderRequestDTO {
  clientId: string;
  restaurantId: string;
  items: SaveOrderItemDTO[];
  appliedPromotionId: string | null;
}

