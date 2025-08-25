import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Room } from '../model/Room';
import { HttpClient } from '@angular/common/http';
import { CreateRoomRequestDTO } from '../model/CreateRoomRequestDTO';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private path = environment.apiUrl + '/v1/rooms';
  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las habitaciones asociadas a un hotel específico.
   *
   * @param id identificador único del hotel
   * @returns Observable<Room[]> con la lista de habitaciones del hotel
   */
  getRoomsByHotelId(id: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.path}/${id}`);
  }

  /**
   * Crea una nueva habitación en un hotel específico.
   *
   * @param hotelId identificador único del hotel
   * @param roomRequest objeto con los datos de la habitación a crear
   * @returns Observable<void> indicando el resultado de la operación
   */
  createRoom(hotelId: string, roomRequest: CreateRoomRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.path}/${hotelId}`, roomRequest);
  }
}
