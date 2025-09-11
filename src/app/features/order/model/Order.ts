import { OrderItem } from './OrderItem';

/**
 * Representa una orden creada en el sistema.
 */
export interface Order {
  id: string;
  clientId: string;
  restaurantId: string;
  appliedPromotionId?: string | null;

  clientName: string;
  restaurantName: string;
  promotionName?: string | null;

  subTotalAmount: number;
  discountAmount: number;
  totalAmount: number;

  orderAt: Date;
  orderAtStr: string;

  items: OrderItem[];
}
