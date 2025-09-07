import { Promotion } from './Promotion';

/**
 * Promoción asociada a una habitación.
 * Extiende de Promotion y agrega el identificador de la habitación.
 */
export interface PromotionRoom extends Promotion {
  roomId: string;
  hotelId: string;
  roomName: string;
  hotelName: string;
}
