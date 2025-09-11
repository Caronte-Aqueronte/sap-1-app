import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateBookingRequestDTO } from '../model/CreateBookingRequestDTO';
import { MostPopularRoom } from '../../room/model/MostPopularRoom';
import { Booking } from '../model/Booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private path = environment.apiUrl + '/v1/bookings';
  constructor(private http: HttpClient) {}

  /**
   * Crea la reserva y devuelve la factura en PDF
   *
   * @param body datos de la reserva
   * @return Observable con la respuesta que contiene el PDF
   */
  createBooking(body: CreateBookingRequestDTO): Observable<HttpResponse<Blob>> {
    const url = `${this.path}/create`;

    return this.http
      .post(url, body, {
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

  /**
   * Obtiene la habitación más popular de un hotel.
   * @param hotelId identificador del hotel
   */
  getMostPopularRoom(hotelId: string): Observable<MostPopularRoom> {
    return this.http.get<MostPopularRoom>(
      `${this.path}/public/most-popular-room/${hotelId}`
    );
  }

  /**
   * Lista reservas, opcionalmente filtrando por hotel
   */
  getAll(hotelId?: string | null): Observable<Booking[]> {
    const params = hotelId ? new HttpParams().set('hotelId', hotelId) : undefined;
    return this.http.get<Booking[]>(`${this.path}`, { params });
  }

  /**
   * Cancela una reserva
   */
  cancel(bookingId: string): Observable<void> {
    return this.http.post<void>(`${this.path}/public/cancel/${bookingId}`, {});
  }

  /**
   * Marca check-out de una reserva
   */
  checkOut(bookingId: string): Observable<void> {
    return this.http.post<void>(`${this.path}/check-out/${bookingId}`, {});
  }
}
