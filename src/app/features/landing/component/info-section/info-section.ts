import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { HotelService } from '../../../hotel/service/hotel-service';
import { ToastrService } from 'ngx-toastr';
import { Hotel } from '../../../hotel/model/Hotel';

@Component({
  selector: 'app-info-section',
  imports: [
    NzSelectModule,
    NzDatePickerModule,
    NzIconModule,
    NzGridModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzFormModule,
  ],
  templateUrl: './info-section.html',
  styleUrl: './info-section.css',
})
export class InfoSection implements OnInit {
  hotels: Hotel[] = [];

  private fb = inject(NonNullableFormBuilder);

  bookingSearchForm = this.fb.group({
    hotel: [null, [Validators.required]],
    checkIn: [null, [Validators.required]],
    checkOut: [null, [Validators.required]],
  });

  constructor(
    private router: Router,
    private hotelService: HotelService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadHotels();
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

  search() {
    if (this.bookingSearchForm.invalid) {
      this.toastrService.error('Por favor completa todos los campos');
      return;
    }

    const { hotel, checkIn, checkOut } = this.bookingSearchForm.value;

    if (checkIn && checkOut && checkIn >= checkOut) {
      this.toastrService.error(
        'La fecha de entrada debe ser antes que la de salida'
      );
      return;
    }

    this.router.navigate(['/landing/search-results'], {
      queryParams: {
        hotelId: hotel,
        checkIn: checkIn,
        checkOut: checkOut,
      },
    });
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
