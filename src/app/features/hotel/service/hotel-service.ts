import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateHotelRequestDTO as SaveHotelRequestDTO } from '../model/CreateHotelRequestDTO';
import { Observable } from 'rxjs';
import { Hotel } from '../model/Hotel';

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
  public createHotel(body: SaveHotelRequestDTO): Observable<void> {
    return this.http.post<void>(this.path, body);
  }

  /**
   * Obtiene todos los hoteles del sistema.
   *
   * @returns Observable<Hotel[]> con la lista de hoteles registrados
   */
  public getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.path}/public`);
  }

  /**
   * Obtiene un hotel por id.
   *
   * @returns Observable<Hotel[]> con la lista de hoteles registrados
   */
  public getHotelById(id: String): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.path}/public/${id}`);
  }

  /**
   * Actualiza los datos de un hotel existente en el sistema.
   *
   * @param id identificador único del hotel a actualizar
   * @param body objeto {@link Hotel} con los nuevos valores
   * @returns Observable<void> que completa cuando la operación finaliza
   */
  public updateHotel(id: string, body: SaveHotelRequestDTO): Observable<void> {
    return this.http.patch<void>(`${this.path}/${id}`, body);
  }
}
