import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ToastrService } from 'ngx-toastr';

import { ErrorRenderService } from '../../../../../core/services/error-render-service';
import { BookingService } from '../../../../booking/service/booking-service';
import { Hotel } from '../../../../hotel/model/Hotel';
import { HotelService } from '../../../../hotel/service/hotel-service';
import { MostPopularRoom } from '../../../../room/model/MostPopularRoom';
import { PromotionBaseForm } from '../../../component/promotion-base-form/promotion-base-form';
import { SavePromotionRoomRequestDTO } from '../../../model/request/SavePromotionRoomRequestDTO';
import { PromotionRoomService } from '../../../service/promotion-room-service';

@Component({
  selector: 'app-create-room-promotion-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzModalModule,
    NzSelectModule,
    NzIconModule,
    PromotionBaseForm,
    FormsModule,
  ],
  templateUrl: './create-room-promotion-form.html',
})
export class CreateRoomPromotionForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  hotels: Hotel[] = [];
  selectedHotelId: string | null = null;
  mostPopularRoom: MostPopularRoom | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    discountPercent: [
      1,
      [Validators.required, Validators.min(1), Validators.max(100)],
    ],
    startDate: [null as Date | null, [Validators.required]],
    endDate: [null as Date | null, [Validators.required]],
  });

  constructor(
    private modal: NzModalRef,
    private hotelService: HotelService,
    private bookingService: BookingService,
    private promotionRoomService: PromotionRoomService,
    private toastr: ToastrService,
    private errorRender: ErrorRenderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  /**
   * Carga la lista de hoteles para el selector.
   */
  private loadHotels(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (data: Hotel[]) => {
        this.hotels = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }

  /**
   * Maneja el cambio de hotel seleccionado y consulta la habitación más popular.
   *
   * @param hotelId identificador del hotel seleccionado
   */
  onHotelChange(hotelId: string): void {

    this.selectedHotelId = hotelId || null;
    this.mostPopularRoom = null;

    if (!this.selectedHotelId) {
      return;
    }

    this.bookingService.getMostPopularRoom(this.selectedHotelId).subscribe({
      next: (data) => {
        this.mostPopularRoom = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }

  /**
   * Envía la solicitud de creación de la promoción de habitación.
   * @returns void
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('Formulario inválido, revisa los campos');
      return;
    }
    if (!this.selectedHotelId) {
      this.toastr.error('Seleccione un hotel');
      return;
    }
    if (!this.mostPopularRoom) {
      this.toastr.error('No se pudo determinar la habitación más popular');
      return;
    }

    const formValue = this.form.getRawValue();

    const req: SavePromotionRoomRequestDTO = {
      name: formValue.name.trim(),
      discountPercent: formValue.discountPercent,
      startDate: formValue.startDate!.toISOString(),
      endDate: formValue.endDate!.toISOString(),
      hotelId: this.selectedHotelId,
      roomId: this.mostPopularRoom.roomId,
    };

    this.promotionRoomService.create(req).subscribe({
      next: () => {
        this.toastr.success('Promoción de habitación creada');
        this.modal.destroy(true);
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }
}
