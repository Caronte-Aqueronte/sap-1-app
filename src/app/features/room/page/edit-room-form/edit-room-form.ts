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
import { CreateRoomRequestDTO } from '../../model/CreateRoomRequestDTO';
import { RoomService } from '../../service/room-service';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { Hotel } from '../../../../core/model/establishment/Hotel';
import { Room } from '../../model/Room';

@Component({
  selector: 'app-edit-room-form',
  imports: [
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
  ],
  templateUrl: './edit-room-form.html',
  styleUrl: './edit-room-form.css',
})
export class EditRoomForm {
  room: Room;
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
    @Inject(NZ_MODAL_DATA) public data: { room: Room }
  ) {
    this.room = data.room;
    this.formRoom.patchValue(this.room); //adjunta la info del hotel al formulario
  }

  onEdit() {
    //vaida que el form este valido
    if (!this.formRoom.valid) {
      this.toastrService.error('Formulario inválido, revisa los campos');
      return;
    }

    const request: CreateRoomRequestDTO = this.formRoom.getRawValue();

    this.roomService.editRoom(this.room.id, request).subscribe({
      next: () => {
        this.toastrService.success('Habitación editada exitosamente');
        this.modal.close(true); // cerrar modal devolviendo true para refrescar la lista
      },
      error: (err) => {
        this.toastrService.error(this.errorRenderService.render(err.error));
      },
    });
  }
}
