import { Component, Inject, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { RoomService } from '../../service/room-service';
import { Hotel } from '../../../hotel/model/Hotel';
import { CreateRoomRequestDTO } from '../../model/CreateRoomRequestDTO';

@Component({
  selector: 'app-create-room-form',
  imports: [
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
  ],
  templateUrl: './create-room-form.html',
  styleUrl: './create-room-form.css',
})
export class CreateRoomForm {
  // inyecta el formBuilder
  private fb = inject(NonNullableFormBuilder);

  //formulario de las habitaciones
  formRoom = this.fb.group({
    number: ['', [Validators.required, Validators.maxLength(100)]],
    basePrice: [0, [Validators.required, Validators.min(0.01)]],
    maintenanceCost: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private modal: NzModalRef,
    private roomService: RoomService,
    private toastrService: ToastrService,
    private errorRenderService: ErrorRenderService,
    @Inject(NZ_MODAL_DATA) public data: { hotel: Hotel }
  ) {}

  /**
   * Envía el formulario al backend para crear la habitación.
   */
  onCreate(): void {
    //vaida que el form este valido
    if (!this.formRoom.valid) {
      this.toastrService.error('Formulario inválido, revisa los campos');
      return;
    }

    const request: CreateRoomRequestDTO = this.formRoom.getRawValue();

    this.roomService.createRoom(this.data.hotel.id, request).subscribe({
      next: () => {
        this.toastrService.success('Habitación creada exitosamente');
        this.modal.close(true); // cerrar modal devolviendo true para refrescar la lista
      },
      error: (err) => {
        this.toastrService.error(this.errorRenderService.render(err.error));
      },
    });
  }
}
