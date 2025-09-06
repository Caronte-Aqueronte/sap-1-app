import { SavePromotionRequestDTO } from './SavePromotionRequestDTO';

/**
 * DTO de entrada para crear promociones de habitaciones.
 */
export interface SavePromotionRoomRequestDTO extends SavePromotionRequestDTO {
  hotelId: string;
  roomId: string;
}

