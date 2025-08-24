import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateHotelRequestDTO } from '../model/CreateHotelRequestDTO';
import { Observable } from 'rxjs';
import { Hotel } from '../../../core/model/establishment/Hotel';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private path = environment.apiUrl + '/v1/hotels';
  constructor(private http: HttpClient) {}

  /**
   * CFrea un hotel en el sistema
   *
   * @param body objeto con los datos del hotel
   * @returns Observable<void> indicando que la operación fue realizada
   */
  public createHotel(body: CreateHotelRequestDTO): Observable<void> {
    return this.http.post<void>(this.path, body);
  }

  /**
   * Obtiene todos los hoteles del sistema.
   *
   * @returns Observable<Hotel[]> con la lista de hoteles registrados
   */
  public getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.path);
  }
}
