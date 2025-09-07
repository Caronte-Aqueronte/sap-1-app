import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PromotionRoom } from '../model/PromotionRoom';
import { SavePromotionRoomRequestDTO } from '../model/request/SavePromotionRoomRequestDTO';

@Injectable({ providedIn: 'root' })
export class PromotionRoomService {
  private readonly path = environment.apiUrl + '/v1/promotions-room';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las promociones de habitación registradas.
   * @returns Observable con el listado de {@link PromotionRoom}
   */
  public getAll(): Observable<PromotionRoom[]> {
    return this.http.get<PromotionRoom[]>(this.path);
  }

  /**
   * Crea una nueva promoción de habitación.
   * @param request datos requeridos para la creación
   * @returns Observable vacío que completa al crear
   */
  public create(request: SavePromotionRoomRequestDTO): Observable<void> {
    return this.http.post<void>(this.path, request);
  }
}
