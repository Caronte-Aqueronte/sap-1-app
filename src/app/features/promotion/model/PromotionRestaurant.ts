import { Promotion } from './Promotion';

/**
 * Promoción asociada a un restaurante.
 * Extiende de Promotion y agrega el identificador del restaurante.
 */
export interface PromotionRestaurant extends Promotion {
  restaurantId: string; // UUID
}

