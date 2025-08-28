import { Component, Inject, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { CreateRoomRequestDTO } from '../../../room/model/CreateRoomRequestDTO';
import { CreateHotelRequestDTO } from '../../model/CreateHotelRequestDTO';
import { HotelService } from '../../service/hotel-service';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Hotel } from '../../model/Hotel';
@Component({
  selector: 'app-edit-hotel-form',
  imports: [
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
  ],
  templateUrl: './edit-hotel-form.html',
  styleUrl: './edit-hotel-form.css',
})
export class EditHotelForm {
  hotel: Hotel;
  private fb = inject(NonNullableFormBuilder);

  // definicion del formulario
  formHotel = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    address: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(200)],
    ],
    phoneNumber: ['', [Validators.required, Validators.maxLength(30)]],
    stars: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  constructor(
    private modal: NzModalRef,
    private hotelService: HotelService,
    private toastr: ToastrService,
    private errorRenderService: ErrorRenderService,
    @Inject(NZ_MODAL_DATA) public data: { hotel: Hotel } // llega el hotel
  ) {
    this.hotel = data.hotel;
    this.formHotel.patchValue(this.hotel); //adjunta la info del hotel al formulario
  }
  onSubmit() {
    //vaida que el form este valido
    if (!this.formHotel.valid) {
      this.toastr.error('Formulario inválido, revisa los campos');
      return;
    }

    //captura el valor del form
    const formValue = this.formHotel.getRawValue();

    const request: CreateHotelRequestDTO = {
      name: formValue.name,
      address: formValue.address,
      phoneNumber: formValue.phoneNumber,
      stars: formValue.stars,
      rooms: null,
    };

    //manda a actualizar
    this.hotelService.updateHotel(this.hotel.id, request).subscribe({
      next: () => {
        this.toastr.success('Hotel actualizado correctamente');
        this.modal.destroy({ success: true }); //cierra la el modal
      },
      error: (err) => {
        this.toastr.error(this.errorRenderService.render(err.error));
      },
    });
  }
}
