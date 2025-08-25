import { CreateRoomRequestDTO } from '../../room/model/CreateRoomRequestDTO';

export interface CreateHotelRequestDTO {
  name: string;
  address: string;
  phoneNumber: string;
  stars: number;
  rooms: CreateRoomRequestDTO[] | null;
}
