import { Booking } from '../../booking/model/Booking';

export interface MostPopularRoomReport {
  hotelName: string;
  roomNumber: string;
  bookings: Booking[];
  totalEntries: number;
  totalIncome: number;
}
