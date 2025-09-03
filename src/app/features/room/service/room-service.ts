import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Room } from '../model/Room';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateRoomRequestDTO as SaveRoomRequestDTO } from '../model/CreateRoomRequestDTO';

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
   * Obtiene todas las habitaciones activas asociadas a un hotel específico.
   *
   * @param id identificador único del hotel
   * @returns Observable<Room[]> con la lista de habitaciones del hotel
   */
  getActiveoomsByHotelId(id: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.path}/active-rooms/${id}`);
  }

  /**
   * Crea una nueva habitación en un hotel específico.
   *
   * @param hotelId identificador único del hotel
   * @param roomRequest objeto con los datos de la habitación a crear
   * @returns Observable<void> indicando el resultado de la operación
   */
  createRoom(
    hotelId: string,
    roomRequest: SaveRoomRequestDTO
  ): Observable<void> {
    return this.http.post<void>(`${this.path}/${hotelId}`, roomRequest);
  }

  /**
   * Edita la información de una habitación existente.
   *
   * @param roomRequest objeto con los datos de la habitación a actualizar
   * @returns Observable<void> indicando el resultado de la operación
   */
  editRoom(roomId: String, roomRequest: SaveRoomRequestDTO): Observable<void> {
    return this.http.patch<void>(`${this.path}/${roomId}`, roomRequest);
  }

  /**
   * Alterna el estado de mantenimiento de una habitación.
   * Cambia entre AVAILABLE y MAINTENANCE, si la habitación no está OCCUPIED.
   *
   * @param roomId identificador único de la habitación
   * @returns Observable<void> indicando el resultado de la operación
   */
  toggleMaintenanceStatus(roomId: string): Observable<void> {
    return this.http.patch<void>(
      `${this.path}/toggle-maintenance-status/${roomId}`,
      {}
    );
  }

  /**
   * Obtiene habitaciones disponibles de un hotel en un rango de fechas
   * @param hotelId id del hotel
   * @param checkIn fecha de inicio
   * @param checkOut fecha de fin
   * @returns Observable con la lista de habitaciones
   */
  searchAvailableRooms(
    hotelId: string,
    checkIn: string,
    checkOut: string
  ): Observable<Room[]> {
    const params = new HttpParams()
      .set('startDate', checkIn)
      .set('endDate', checkOut);

    return this.http.get<any[]>(`${this.path}/available-rooms/${hotelId}`, {
      params,
    });
  }

  /**
   * Obtiene una habitación activa por su ID.
   * Si la habitación existe pero está inactiva, el backend devolverá un error.
   *
   * @param roomId identificador único de la habitación
   * @returns Observable<Room> con la información de la habitación activa
   */
  getActiveRoomById(roomId: string): Observable<Room> {
    return this.http.get<Room>(`${this.path}/active-room/${roomId}`);
  }
}
