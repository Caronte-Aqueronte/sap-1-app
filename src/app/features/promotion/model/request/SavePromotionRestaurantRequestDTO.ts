import { SavePromotionRequestDTO } from './SavePromotionRequestDTO';

/**
 * DTO de entrada para crear promociones de restaurante.
 */
export interface SavePromotionRestaurantRequestDTO extends SavePromotionRequestDTO {
  restaurantId: string;
}

