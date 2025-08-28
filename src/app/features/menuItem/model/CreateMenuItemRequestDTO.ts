/**
 * DTO de request para la creacion de un item de menu desde la capa web
 */
export interface CreateMenuItemRequestDTO {
  name: string;
  description: string;
  price: number;
  cost: number;
}
