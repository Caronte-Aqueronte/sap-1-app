import { CreateMenuItemRequestDTO } from '../../menuItem/model/CreateMenuItemRequestDTO';

/**
 * DTO de request para la creacion de un restaurante
 */
export interface SaveRestaurantRequestDTO {
  name: string;
  address: string;
  phoneNumber: string;
  hotelId: string;
  menuItems: CreateMenuItemRequestDTO[] | null;
}
