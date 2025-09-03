import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { Hotel } from '../../model/Hotel';
import { Room } from '../../../room/model/Room';
import { HotelService } from '../../service/hotel-service';
import { RoomService } from '../../../room/service/room-service';
import { RoomCard } from '../../../room/component/room-card/room-card';

@Component({
  selector: 'app-hotel-rooms-page',
  standalone: true,
  imports: [NzPageHeaderModule, RoomCard],
  templateUrl: './hotel-rooms-page.html',
  styleUrl: './hotel-rooms-page.css',
})
export class HotelRoomsPage implements OnInit {
  hotel!: Hotel;
  rooms: Room[] = [];

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  /**
   * inicializa el componente
   * obtiene el id del hotel desde la ruta y carga hotel y habitaciones
   */
  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get('id');

    // si no hay id de hotel se detiene el flujo
    if (!hotelId) {
      return;
    }

    this.loadHotel(hotelId);
    this.loadRooms(hotelId);
  }

  /**
   * carga la informacion del hotel por id
   *
   * @param hotelId identificador del hotel
   */
  loadHotel(hotelId: string): void {
    this.hotelService.getHotelById(hotelId).subscribe({
      next: (hotel: Hotel) => {
        this.hotel = hotel;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error obteniendo hotel', err),
    });
  }

  /**
   * carga la lista de habitaciones de un hotel
   *
   * @param hotelId identificador del hotel
   */
  loadRooms(hotelId: string): void {
    this.roomService.getActiveoomsByHotelId(hotelId).subscribe({
      next: (rooms: Room[]) => {
        this.rooms = rooms;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error obteniendo habitaciones', err),
    });
  }

  /**
   * COnduce al detalle de una habitacion
   * @param room room a mostrar
   */
  onViewRoom(room: Room): void {
    this.router.navigate(['/landing/room-detail', room.id]);
  }
}
