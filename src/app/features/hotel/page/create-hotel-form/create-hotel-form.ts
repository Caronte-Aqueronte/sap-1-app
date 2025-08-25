import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { CreateRoomRequestDTO } from '../../../room/model/CreateRoomRequestDTO';
import { CreateHotelRequestDTO } from '../../model/CreateHotelRequestDTO';
import { HotelService } from '../../service/hotel-service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
@Component({
  selector: 'app-create-hotel-form',
  imports: [
    NzButtonModule,
    NzModalModule,
    NzStepsModule,
    NzIconModule,
    NzTableModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzDividerModule,
  ],
  templateUrl: './create-hotel-form.html',
  styleUrl: './create-hotel-form.css',
})
export class CreateHotelForm {
  // inyecta el formBuilder
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

  //formulario de las habitaciones
  formRoom = this.fb.group({
    number: ['', [Validators.required, Validators.maxLength(100)]],
    basePrice: [0, [Validators.required, Validators.min(0.01)]],
    maintenanceCost: [0, [Validators.required, Validators.min(0)]],
  });
  current = 0;

  rooms: CreateRoomRequestDTO[] = [];

  constructor(
    private modal: NzModalRef,
    private hotelService: HotelService,
    private toastrService: ToastrService,
    private errorRenderService: ErrorRenderService
  ) {}

  onSubmit(): void {
    //vaida que el form este valido
    if (!this.formHotel.valid) {
      this.toastrService.error('Formulario inválido, revisa los campos');
      return;
    }

    //captura el valor del form
    const formValue = this.formHotel.getRawValue();

    const request: CreateHotelRequestDTO = {
      name: formValue.name,
      address: formValue.address,
      phoneNumber: formValue.phoneNumber,
      stars: formValue.stars,
      rooms: this.rooms,
    };

    this.hotelService.createHotel(request).subscribe({
      next: () => {
        this.toastrService.success('Hotel creado exitosamente', 'Éxito');
        this.modal.destroy({ success: true });
      },
      error: (err) => {
        this.toastrService.error(this.errorRenderService.render(err.error));
        console.error('Error creando hotel', err);
      },
    });
  }


  pre(): void {
    this.current -= 1;
  }

  next(): void {
    //evalua que el formulario este valido
    if (this.current === 0 && this.formHotel.invalid) {
      this.toastrService.error('Completa los datos del hotel');
      this.formHotel.markAllAsTouched();
      return;
    }
    this.current += 1;
  }

  addRoom(): void {
    //si el formulario esta invalido entonces lanzamos error
    if (this.formRoom.invalid) {
      return;
    }

    //agrega al array la nueva room
    this.rooms.push(this.formRoom.getRawValue());
    this.formRoom.reset({ basePrice: 0, maintenanceCost: 0 });
  }

  removeRoom(index: number): void {
    this.rooms.splice(index, 1);
  }
}
