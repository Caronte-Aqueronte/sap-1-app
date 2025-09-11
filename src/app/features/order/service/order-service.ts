import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Order } from '../model/Order';
import { CreateOrderRequestDTO } from '../model/CreateOrderRequestDTO';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private path = environment.apiUrl + '/v1/orders';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las órdenes creadas
   * @returns lista de ordenes creadas
   */
  public getAll(restaurantId?: string | null): Observable<Order[]> {
    const params = restaurantId
      ? new HttpParams().set('restaurantId', restaurantId)
      : undefined;
    return this.http.get<Order[]>(this.path, { params });
  }

  /**
   * Obtiene el detalle de una orden por su ID
   */
  public getById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.path}/${orderId}`);
  }

  /**
   * Crea una orden y devuelve el comprobante PDF
   * @param body datos de la orden
   */
  public createOrder(
    body: CreateOrderRequestDTO
  ): Observable<HttpResponse<Blob>> {
    return this.http
      .post(this.path, body, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (
            err.error instanceof Blob &&
            err.error.type === 'application/json'
          ) {
            return new Promise<any>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  reject(JSON.parse(reader.result as string));
                } catch (e) {
                  reject({
                    message: 'Error parseando respuesta de error',
                    raw: reader.result,
                  });
                }
              };
              reader.readAsText(err.error);
            });
          }
          return throwError(() => err);
        })
      );
  }
}
