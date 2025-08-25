import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CreateHotelForm } from '../create-hotel-form/create-hotel-form';
import { Hotel } from '../../../../core/model/establishment/Hotel';
import { HotelService } from '../../service/hotel-service';
import { EditHotelForm } from '../edit-hotel-form/edit-hotel-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotels-page',
  imports: [
    NzDividerModule,
    NzTableModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzModalModule,
  ],
  templateUrl: './hotels-page.html',
  styleUrl: './hotels-page.css',
})
export class HotelsPage implements OnInit {
  hotels!: Hotel[];

  constructor(
    private modalService: NzModalService,
    private hotelService: HotelService,
    private cdr: ChangeDetectorRef,
    private router: Router
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
  /**
   * Abre el modal de creacion de un hotel
   */
  onCreateHotel() {
    const modal = this.modalService.create({
      nzTitle: 'Crear Hotel',
      nzContent: CreateHotelForm,
      nzCentered: true,
    });

    //espera a que se cierre el modal, si se lanza un sicces entonces manda a traer todos los hoteles
    modal.afterClose.subscribe((result) => {
      if (result?.success) {
        this.loadHotels();
      }
    });
  }

  /**
   * Abre el modal de actualizacion
   * @param hotel
   */
  onUpdateHotel(hotel: Hotel): void {
    const modal = this.modalService.create({
      nzTitle: 'Editar Hotel',
      nzContent: EditHotelForm,
      nzData: {
        hotel: hotel, // se pasa el hotel como input
      },
      nzCentered: true,
    });

    //espera a que se cierre el modal, si se lanza un sicces entonces manda a traer todos los hoteles
    modal.afterClose.subscribe((result) => {
      if (result?.success) {
        this.loadHotels();
      }
    });
  }

  onViewHotel(hotel: Hotel) {
    this.router.navigate(['/dashboard/admin/hotel-detail', hotel.id]);
  }
}
