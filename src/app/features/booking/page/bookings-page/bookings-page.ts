import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { Hotel } from '../../../hotel/model/Hotel';
import { HotelService } from '../../../hotel/service/hotel-service';
import { Booking } from '../../model/Booking';
import { BookingService } from '../../service/booking-service';

@Component({
  selector: 'app-bookings-page',
  imports: [
    NzDividerModule,
    NzTableModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzModalModule,
    NzSelectModule,
    FormsModule,
    NzTagModule,
  ],
  templateUrl: './bookings-page.html',
  styleUrl: './bookings-page.css',
})
export class BookingsPage implements OnInit {
  hotels: Hotel[] = [];
  bookings: Booking[] = [];
  selectedHotelId: string | null = null;

  constructor(
    private hotelService: HotelService,
    private bookingService: BookingService,
    private toastrService: ToastrService,
    private errorRenderService: ErrorRenderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadHotels();
    this.loadBookings();
  }

  /**
   * Carga la lista de hoteles desde el servicio
   */
  private loadHotels(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (data: Hotel[]) => {
        this.hotels = data;
        this.cdr.detectChanges(); //regresca cambios
      },
      error: (err) => {
        console.error('Error cargando hoteles', err);
      },
    });
  }

  /**
   * Carga las reservas opcionalmente filtradas por hotel
   */
  private loadBookings(): void {
    this.bookingService.getAll(this.selectedHotelId ?? undefined).subscribe({
      next: (data: Booking[]) => {
        this.bookings = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastrService.error(this.errorRenderService.render(err.error)),
    });
  }

  onHotelChange(hotelId: string | null) {
    this.selectedHotelId = hotelId;
    this.loadBookings();
  }

  onCancel(booking: Booking): void {
    this.bookingService.cancel(booking.id).subscribe({
      next: () => {
        this.toastrService.success('Reserva cancelada');
        this.loadBookings();
      },
      error: (err) => this.toastrService.error(this.errorRenderService.render(err.error)),
    });
  }

  onCheckOut(booking: Booking): void {
    this.bookingService.checkOut(booking.id).subscribe({
      next: () => {
        this.toastrService.success('Reserva marcada como check-out');
        this.loadBookings();
      },
      error: (err) => this.toastrService.error(this.errorRenderService.render(err.error)),
    });
  }
}
