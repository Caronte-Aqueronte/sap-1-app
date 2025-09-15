import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PromotionRestaurant } from '../model/PromotionRestaurant';
import { SavePromotionRestaurantRequestDTO } from '../model/request/SavePromotionRestaurantRequestDTO';

@Injectable({ providedIn: 'root' })
export class PromotionRestaurantService {
  private path = environment.apiUrl + '/v1/promotions-restaurant';

  constructor(private http: HttpClient) {}

  /**
   * Trae las promociones de un restaurante por el id
   * @param restaurantId promociones obtenidasF
   * @returns
   */
  public getActiveRestaurantPromotionsByRestaurant(
    restaurantId: string
  ): Observable<PromotionRestaurant[]> {
    return this.http.get<PromotionRestaurant[]>(
      `${this.path}/public/active-promotions/by-restaurant/${restaurantId}`
    );
  }
  /**
   * Obtiene todas las promociones de restaurantes
   *
   * @returns Observable con la lista de promociones
   */
  public getAll(): Observable<PromotionRestaurant[]> {
    return this.http.get<PromotionRestaurant[]>(this.path);
  }

  /**
   * Crea una nueva promoción de restaurante
   *
   * Envía al backend el request con los datos de la promoción
   * de restaurante para ser almacenada.
   *
   * @param request DTO con los datos de la promoción a crear
   * @returns Observable vacío que indica la finalización de la operación
   */
  public create(request: SavePromotionRestaurantRequestDTO): Observable<void> {
    return this.http.post<void>(this.path, request);
  }
}
