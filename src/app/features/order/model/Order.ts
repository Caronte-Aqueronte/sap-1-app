/**
 * Representa una orden creada en el sistema.
 */
export interface Order {
  id: string;
  clientId: string;
  restaurantId: string;
  total: number;
  createdAt: string;
  appliedPromotionId?: string | null;
}
