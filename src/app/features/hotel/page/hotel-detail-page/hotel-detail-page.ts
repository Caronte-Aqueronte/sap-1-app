import { ChangeDetectorRef, Component } from '@angular/core';
import { Hotel } from '../../model/Hotel';
import { ActivatedRoute } from '@angular/router';
import { HotelService } from '../../service/hotel-service';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { ToastrService } from 'ngx-toastr';
import { Room } from '../../../room/model/Room';
import { RoomService } from '../../../room/service/room-service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { CommonModule } from '@angular/common';
import { CreateRoomForm } from '../../../room/page/create-room-form/create-room-form';
import { EditRoomForm } from '../../../room/page/edit-room-form/edit-room-form';
import { RoomStatus } from '../../../room/model/RoomStatus';

@Component({
  selector: 'app-hotel-detail-page',
  imports: [
    CommonModule,
    NzTableModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzSpaceModule,
    NzDividerModule,
  ],
  templateUrl: './hotel-detail-page.html',
  styleUrl: './hotel-detail-page.css',
})
export class HotelDetailPage {
  statusMap: Record<string, { text: string; color: string }> = {
    ACTIVE: { text: 'Activa', color: 'bg-green-500' },
    INACTIVE: { text: 'Inactiva', color: 'bg-red-500' },
  };
  hotel!: Hotel;
  rooms: Room[] = [];
  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private roomService: RoomService,
    private errorRender: ErrorRenderService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.getHotelById();
    this.getRoomsByHotelId();
  }

  /**
   * Obtiene la información del hotel actual a partir del parámetro de ruta `id`.
   */
  private getHotelById() {
    const id = this.route.snapshot.paramMap.get('id')!; //obteiene id de la ruta
    this.hotelService.getHotelById(id).subscribe({
      next: (hotel: Hotel) => {
        this.hotel = hotel;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }

  /**
   * Obtiene todas las habitaciones asociadas a un hotel específico.
   */
  private getRoomsByHotelId(): void {
    const id = this.route.snapshot.paramMap.get('id')!; //obteiene id de la ruta

    this.roomService.getRoomsByHotelId(id).subscribe({
      next: (rooms: Room[]) => {
        this.rooms = rooms;
        this.cdr.detectChanges(); //regresca cambios
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }

  /**
   * Abre el modal de creacion de una habitacion
   */
  onCreateRoom() {
    const modal = this.modalService.create({
      nzTitle: 'Crear Habitación',
      nzContent: CreateRoomForm,
      nzData: {
        hotel: this.hotel, // se pasa el hotel como input
      },
      nzCentered: true,
    });

    //espera a que se cierre el modal, si se lanza un sicces entonces manda a traer todas las habs
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getRoomsByHotelId();
      }
    });
  }

  /**
   * Abre un modal para editar la información de una habitación.
   */
  onUpdateRoom(room: Room) {
    const modal = this.modalService.create({
      nzTitle: 'Editar Habitación',
      nzContent: EditRoomForm,
      nzData: {
        room: room, // se pasa el hotel como input
      },
      nzCentered: true,
    });

    //espera a que se cierre el modal, si se lanza un sicces entonces manda a traer todos los hoteles
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getRoomsByHotelId();
      }
    });
  }

  /**
   * Cambia el estado de una habitación entre Disponible y Mantenimiento.
   *
   * @param room habitación seleccionada
   */
  onToggleStatus(room: Room): void {
    // si está ocupada no permitimos cambiar a mantenimiento
    this.roomService.toggleMaintenanceStatus(room.id).subscribe({
      next: () => {
        this.toastr.success(`La habitación ${room.number} cambió de estado`);
        this.getRoomsByHotelId(); // refresca lista
      },
      error: (err) => {
        this.toastr.error(this.errorRender.render(err.error));
      },
    });
  }
}
