import { Restaurant } from '../../restaurant/model/Restaurant';

/**
 * DTO de respuesta para la representacion de un item de menu
 */
export interface MenuItem {
  id: string;
  restaurant: Restaurant;
  name: string;
  description: string;
  price: number; 
  cost: number;
}
