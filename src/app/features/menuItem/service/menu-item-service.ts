import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateMenuItemRequestDTO } from '../model/CreateMenuItemRequestDTO';
import { MenuItem } from '../model/MenuItem';

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  private path = environment.apiUrl + '/v1/menu-items';

  constructor(private http: HttpClient) {}

  /**
   * crea un nuevo item de menu en un restaurante especifico
   * @param restaurantId identificador del restaurante
   * @param request datos del item de menu
   * @returns observable vacio cuando la operacion es exitosa
   */
  public createMenuItem(
    restaurantId: string,
    request: CreateMenuItemRequestDTO
  ): Observable<void> {
    return this.http.post<void>(`${this.path}/${restaurantId}`, request);
  }

  /**
   * edita un item de menu existente
   * @param menuItemId identificador del item de menu
   * @param request datos del item de menu a actualizar
   * @returns observable vacio cuando la operacion es exitosa
   */
  public editMenuItem(
    menuItemId: string,
    request: CreateMenuItemRequestDTO
  ): Observable<void> {
    return this.http.patch<void>(`${this.path}/${menuItemId}`, request);
  }

  /**
   * obtiene todos los items de menu asociados a un restaurante
   * @param restaurantId identificador del restaurante
   * @returns observable con la lista de items de menu
   */
  public getAllByRestaurantId(
    restaurantId: string
  ): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(
      `${this.path}/menu-by-restaurant/${restaurantId}`
    );
  }
}
