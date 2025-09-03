import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { Hotel } from '../../../hotel/model/Hotel';
import { Room } from '../../../room/model/Room';
import { RoomService } from '../../../room/service/room-service';
import { RoomBookingCard } from '../../../landing/component/room-booking-card/room-booking-card';
import { CommonModule, formatDate } from '@angular/common';
import { HotelService } from '../../../hotel/service/hotel-service';

@Component({
  selector: 'app-search-results-component',
  imports: [NzPageHeaderModule, NzIconModule, RoomBookingCard],
  templateUrl: './search-results-component.html',
  styleUrl: './search-results-component.css',
})
export class SearchResultsComponent implements OnInit {
  results: Room[] = [];
  hotel!: Hotel;

  rawCheckIn = '';
  rawCheckOut = '';
  displayCheckIn = '';
  displayCheckOut = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private hotelService: HotelService,
    private errorRenderService: ErrorRenderService
  ) {}

  ngOnInit(): void {
    this.getHotelById();
    this.search();
  }

  /**
   * Obtiene la información del hotel actual a partir del parámetro de ruta `id`.
   */
  private getHotelById() {
    const params = this.route.snapshot.queryParams;
    const hotelId = params['hotelId'];
    this.hotelService.getHotelById(hotelId).subscribe({
      next: (hotel: Hotel) => {
        this.hotel = hotel;
        this.cdr.detectChanges();
      },
      error: (err) =>
        this.toastrService.error(this.errorRenderService.render(err.error)),
    });
  }

  search(): void {
    const params = this.route.snapshot.queryParams;
    //extrae la info de lass query param
    const hotelId = params['hotelId'];
    this.rawCheckIn = params['checkIn'];
    this.rawCheckOut = params['checkOut'];

    // formateo para mostrar
    this.displayCheckIn = formatDate(this.rawCheckIn, 'dd/MM/yyyy', 'en-US');
    this.displayCheckOut = formatDate(this.rawCheckOut, 'dd/MM/yyyy', 'en-US');

    //formateo para consultar al back
    const checkInDate = new Date(this.rawCheckIn).toISOString().split('T')[0];
    const checkOutDate = new Date(this.rawCheckOut).toISOString().split('T')[0];

    if (!hotelId || !this.rawCheckIn || !this.rawCheckOut) {
      this.toastrService.warning('Faltan parámetros de búsqueda');
      return;
    }

    if (new Date(this.rawCheckIn) >= new Date(this.rawCheckOut)) {
      this.toastrService.error(
        'La fecha de entrada debe ser antes que la de salida'
      );
      return;
    }

    this.roomService
      .searchAvailableRooms(hotelId, checkInDate, checkOutDate)
      .subscribe({
        next: (data) => {
          this.results = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.toastrService.error(this.errorRenderService.render(err?.error));
        },
      });
  }

  /**
   * Redirige al detalle de una habitación específica.
   *
   * @param room habitación seleccionada
   */
  onReserve(room: Room) {
    this.router.navigate([`/landing/room-booking-detail/${room.id}`], {
      //pasa como params las fechas seleccionadas
      queryParams: {
        checkIn: this.rawCheckIn,
        checkOut: this.rawCheckOut,
      },
    });
  }
}
