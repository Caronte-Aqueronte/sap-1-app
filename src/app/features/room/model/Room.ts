import { RoomStatus } from './RoomStatus';
import { Hotel } from '../../hotel/model/Hotel';

/**
Representa una habitacion en el sistema
 */
export interface Room {
  id: string;
  hotel: Hotel;
  number: string;
  basePrice: number;
  maintenanceCost: number;
  status: RoomStatus;
}
