import { Hotel } from '../../hotel/model/Hotel';

/**
 * DTO de respuesta para representar la informacion de un restaurante
 */
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  hotel: Hotel;
}
