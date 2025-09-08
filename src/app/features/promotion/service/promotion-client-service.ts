import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PromotionClient } from '../model/PromotionClient';
import { SavePromotionClientRequestDTO } from '../model/request/SavePromotionClientRequestDTO';

@Injectable({ providedIn: 'root' })
export class PromotionClientService {
  private path = environment.apiUrl + '/v1/promotions-client';

  constructor(private http: HttpClient) {}

  /**
   * Lista todas las promociones de clientes frecuentes
   * @returns lista de promciones de cleinte
   */
  public getAll(): Observable<PromotionClient[]> {
    return this.http.get<PromotionClient[]>(this.path);
  }

  /**
   * Lista todas las promociones activasf de clientes frecuentes
   * @returns lista de promciones de cleinte
   */
  public getActivePromotions(): Observable<PromotionClient[]> {
    return this.http.get<PromotionClient[]>(`${this.path}/public`);
  }

  /**
   *  Crea una nueva promoción de cliente frecuente
   * @param request request para mandar a crear
   * @returns
   */
  public create(request: SavePromotionClientRequestDTO): Observable<void> {
    return this.http.post<void>(this.path, request);
  }

  /**
   * edita promoción de cliente frecuente
   * @param request request para mandar a crear
   * @returns
   */
  public edit(
    request: SavePromotionClientRequestDTO,
    promotionId: string
  ): Observable<void> {
    return this.http.patch<void>(`${this.path}/${promotionId}`, request);
  }
}
