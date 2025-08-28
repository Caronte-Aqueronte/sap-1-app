import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Restaurant } from '../model/Restaurant';
import { Observable } from 'rxjs';
import { CreateMenuItemRequestDTO } from '../../menuItem/model/CreateMenuItemRequestDTO';
import { SaveRestaurantRequestDTO } from '../model/CreateRestaurantRequestDTO';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private path = environment.apiUrl + '/v1/restaurants';
  constructor(private http: HttpClient) {}

  /**
   * obtiene todos los items de menu
   */
  public getAllRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.path);
  }

  /**
   * crea un nuevo item de menu
   */
  public createRestaurant(request: SaveRestaurantRequestDTO): Observable<void> {
    return this.http.post<void>(this.path, request);
  }

  /**
   * actualiza la informacion de un restaurante existente
   * @param request datos del restaurante a actualizar
   * @param restaurantId identificador del restaurante a editar
   * @returns observable vacio cuando la operacion es exitosa
   */
  public editRestaurant(
    request: SaveRestaurantRequestDTO,
    restaurantId: String
  ): Observable<void> {
    return this.http.patch<void>(`${this.path}/${restaurantId}`, request);
  }

  /**
   * obtiene la informacion de un hotel por id
   * @param id identificador del hotel
   * @returns observable con el hotel encontrado
   */
  public getRestaurantById(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.path}/${id}`);
  }
}
