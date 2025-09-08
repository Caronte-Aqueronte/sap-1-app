import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { NzModalModule, NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  ReactiveFormsModule,
  Validators,
  NonNullableFormBuilder,
  FormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { BookingService } from '../../service/booking-service';
import { Client } from '../../../client/model/Client';
import { Room } from '../../../room/model/Room';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ClientService } from '../../../client/service/client-service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { CreateClientRequestDTO } from '../../../client/model/CreateClientRequestDTO';
import { CreateBookingRequestDTO } from '../../model/CreateBookingRequestDTO';
import { PromotionClientService } from '../../../promotion/service/promotion-client-service';
import { PromotionRoomService } from '../../../promotion/service/promotion-room-service';
import { PromotionClient } from '../../../promotion/model/PromotionClient';
import { PromotionRoom } from '../../../promotion/model/PromotionRoom';
import { Promotion } from '../../../promotion/model/Promotion';

@Component({
  selector: 'app-create-booking-dialog',
  standalone: true,
  imports: [
    NzModalModule,
    NzStepsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    FormsModule,
    NzDividerModule,
    NzIconModule,
    NzRadioModule,
  ],
  templateUrl: './create-booking-dialog.html',
  styleUrl: './create-booking-dialog.css',
})
export class CreateBookingDialog {
  private fb = inject(NonNullableFormBuilder);

  current = 0;

  // formulario para buscar por el national id
  searchForm = this.fb.group({
    nationalId: [
      '',
      [Validators.required, Validators.maxLength(13), Validators.minLength(13)],
    ],
  });

  // formulario para crear cliente si no existe
  clientForm = this.fb.group({
    nationalId: [
      '',
      [Validators.required, Validators.minLength(13), Validators.maxLength(13)],
    ],
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(150)],
    ],
    phone: ['', [Validators.required, Validators.maxLength(15)]],
    nit: ['', [Validators.required, Validators.maxLength(15)]],
  });

  client: Client | null = null;
  clientNotFound = false;

  // Resumen
  nights = 0;
  checkIn: string;
  checkOut: string;
  total = 0;

  // para selección de promociones
  clientPromotions: PromotionClient[] = [];
  roomPromotions: PromotionRoom[] = [];

  // va a ser el id de la promoción seleccionada. Null para no aplicar.
  selectedPromotionId: Promotion | null = null;

  constructor(
    private modal: NzModalRef,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef,
    private clientService: ClientService,
    private promotionClientService: PromotionClientService,
    private promotionRoomService: PromotionRoomService,
    private toastr: ToastrService,
    private errorRender: ErrorRenderService,
    @Inject(NZ_MODAL_DATA)
    public data: {
      room: Room;
      checkIn: string;
      checkOut: string;
      nights: number;
      total: number;
    }
  ) {
    this.checkIn = data.checkIn;
    this.checkOut = data.checkOut;
    this.nights = data.nights;
    this.total = data.total;
  }

  searchClient(): void {
    const nationalId = this.searchForm.value.nationalId;
    //verifica que se haya ingresado un nationalid
    if (!nationalId) {
      this.toastr.warning('Ingrese el número de identificación');
      return;
    }

    this.clientNotFound = false;
    this.client = null;

    //manda a traer al cliente al back
    this.clientService.getClientByNationalId(nationalId).subscribe({
      next: (client: Client) => {
        this.client = client;
        this.cdr.detectChanges();
        this.toastr.success('Hemos encontrado al cliente !');
      },
      error: (err) => {
        //verifica si server respondio con 404 entonces no existe el cliente
        if (err.status === 404) {
          this.clientNotFound = true;
          this.clientForm.patchValue({ nationalId });
          this.toastr.info('Cliente no existe, complete el formulario datos');
          this.cdr.detectChanges();
        } else {
          this.toastr.error(this.errorRender.render(err.error));
        }
      },
    });
  }

  createClient(): void {
    //valida que el formulario esta valido
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.toastr.error('Complete los datos del cliente');
      return;
    }

    //captura los datos del form
    const body: CreateClientRequestDTO =
      this.clientForm.getRawValue() as CreateClientRequestDTO;

    this.clientService.createClient(body).subscribe({
      next: (created: Client) => {
        //selecciona el cliente y cambia la bandera de desconocido
        this.client = created;
        this.clientNotFound = false;

        this.toastr.success('Cliente creado con exito !');
        this.cdr.detectChanges(); //detecta cambios
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }

  next(): void {
    //valida que al pasar de la primera pag a la segunda haya un cliente seleccionado
    if (this.current === 0) {
      if (!this.client) {
        this.toastr.error('Debe seleccionar o crear un cliente');
        return;
      }
      // Al entrar al paso de promociones, cargamos las listas
      this.loadPromotions();
    }
    this.current += 1;
  }

  pre(): void {
    this.current -= 1;
  }

  confirmBooking(): void {
    if (!this.client) {
      this.toastr.error('Debe seleccionar o crear un cliente');
      return;
    }

    const body: CreateBookingRequestDTO = {
      clientId: this.client.id,
      roomId: this.data.room.id,
      checkInAt: this.checkIn,
      checkOutAt: this.checkOut,
      // Si no hay selección o está vacío, envia null
      appliedPromotionId: this.selectedPromotionId
        ? this.selectedPromotionId.id
        : null,
    };

    console.log(body);

    this.bookingService.createBooking(body).subscribe({
      next: (resp) => {
        const blob = new Blob([resp.body as BlobPart], {
          type: 'application/pdf',
        });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank'); // abre el pdf en una nueva pestaña

        this.toastr.success('Reserva creada con exito !');
        this.modal.destroy({ success: true });
      },
      error: (err) => {
        this.toastr.error(this.errorRender.render(err));
      },
    });
  }

  /**
   * Carga las promociones disponibles.
   * - Trae todas las promociones de cliente.
   * - Trae todas las promociones de habitación y filtra por la habitación seleccionada.
   */
  private loadPromotions(): void {
    const roomId: string = this.data.room.id;

    // promociones de cliente
    this.promotionClientService.getActivePromotions().subscribe({
      next: (data: PromotionClient[]) => {
        this.clientPromotions = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastr.error(this.errorRender.render(err.error));
      },
    });

    // promociones de habitación
    this.promotionRoomService.getByRoomId(roomId).subscribe({
      next: (data: PromotionRoom[]) => {
        this.roomPromotions = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastr.error(this.errorRender.render(err.error));
      },
    });
  }

  /**
   * Si aplica, obtiene el total con descuento
   */
  get discountedTotal(): number {
    if (!this.selectedPromotionId) {
      return this.total;
    }

    const discount =
      (this.total * this.selectedPromotionId.discountPercent) / 100;
    return this.total - discount;
  }
}
