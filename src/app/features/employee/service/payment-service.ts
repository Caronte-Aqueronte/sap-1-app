import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SavePaymentRequestDTO } from '../model/SavePaymentRequestDTO';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private path = environment.apiUrl + '/v1/payments';

  constructor(private http: HttpClient) {}

  /**
   * Crea un nuevo pago en el backend
   * @param body datos requeridos para registrar el pago
   * @returns observable vacio al completar la operacion
   */
  create(body: SavePaymentRequestDTO): Observable<void> {
    return this.http.post<void>(this.path, body);
  }
}
