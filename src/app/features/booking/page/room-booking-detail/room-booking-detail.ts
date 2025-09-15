import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { CreateBookingDialog } from '../create-booking-dialog/create-booking-dialog';
import { ReviewCard } from '../../../review/component/review-card/review-card';
import { CreateReviewRequestDTO } from '../../../review/model/CreateReviewRequestDTO';
import { Review } from '../../../review/model/Review';
import { ReviewService } from '../../../review/service/review-service';
import { Room } from '../../../room/model/Room';
import { RoomService } from '../../../room/service/room-service';
import { formatDate } from '@angular/common';
import { differenceInDays } from 'date-fns';
import { ReviewListSection } from "../../../review/component/review-list-section/review-list-section";
@Component({
  selector: 'app-room-booking-detail',
  imports: [
    NzPageHeaderModule,
    NzIconModule,
    NzDividerModule,
    NzButtonModule,
    NzInputModule,
    ReactiveFormsModule,
    NzFormModule,
    NzRateModule,
    NzModalModule,
    ReviewListSection
],
  templateUrl: './room-booking-detail.html',
  styleUrl: './room-booking-detail.css',
})
export class RoomBookingDetail implements OnInit {
  // inyecta el formBuilder
  private fb = inject(NonNullableFormBuilder);

  //formulario de las habitaciones
  commentForm = this.fb.group({
    rating: [null, [Validators.required]],
    comment: ['', [Validators.maxLength(255)]],
  });

  room!: Room;
  reviews: Review[] = [];
  checkIn!: string;
  checkOut!: string;
  checkInDate!: string;
  checkOutDate!: string;
  displayCheckIn: string = '';
  displayCheckOut: string = '';
  nights: number = 0;
  total: number = 0;

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private errorRender: ErrorRenderService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private reviewService: ReviewService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.captureDatesFromQuery();
    this.findActiveRoom();
  }

  /**
   * Captura las fechas de check-in y check-out desde los query params de la ruta.
   */
  private captureDatesFromQuery() {
    const params = this.route.snapshot.queryParams;
    this.checkIn = params['checkIn'];
    this.checkOut = params['checkOut'];

    if (!this.checkIn || !this.checkOut) {
      return;
    }

    // formateo para mostrar
    this.displayCheckIn = formatDate(this.checkIn, 'dd/MM/yyyy', 'en-US');
    this.displayCheckOut = formatDate(this.checkOut, 'dd/MM/yyyy', 'en-US');

    //formateo para consultar al back
    this.checkInDate = new Date(this.checkIn).toISOString().split('T')[0];
    this.checkOutDate = new Date(this.checkOut).toISOString().split('T')[0];
  }

  findActiveRoom() {
    const roomId = this.route.snapshot.paramMap.get('id');

    if (!roomId) {
      this.toastr.error('No se proporcionó un ID de habitación en la ruta');
      return;
    }

    this.roomService.getActiveRoomById(roomId).subscribe({
      next: (room: Room) => {
        this.room = room;
        this.computeTotals();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastr.error(this.errorRender.render(err.error));
      },
    });
  }

  /**
   * Calcula el total de noches y el monto total de la reserva.
   */
  private computeTotals(): void {
    if (!this.room || !this.checkIn || !this.checkOut) {
      this.nights = 0;
      this.total = 0;
      return;
    }
    const nights = this.calculateNights(this.checkIn, this.checkOut);
    this.nights = nights;
    this.total = this.room.basePrice * nights;
  }

  /**
   * Calcula la diferencia en días completos entre dos fechas.
   *
   * @param checkIn fecha de entrada
   * @param checkOut fecha de salida
   * @returns número de noches entre ambas fechas
   */
  private calculateNights(checkIn: string, checkOut: string): number {
    return differenceInDays(new Date(checkOut), new Date(checkIn));
  }

  /**
   * Abre un modal para gestionar la reserva de una habitación.
   *
   * @param room habitación seleccionada para la reserva
   */
  onReserve(room: Room) {
    const modal = this.modalService.create({
      nzTitle: `Reservar habitación ${room.number}`,
      nzContent: CreateBookingDialog,
      nzData: {
        room: room,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        nights: this.nights,
        total: this.total,
      },
      nzCentered: true,
      nzWidth: 720,
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.toastr.success('Reserva preparada');
      }
    });
  }
}
