import { Component, OnInit } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CreateHotelForm } from '../../component/create-hotel-form/create-hotel-form';
import { Hotel } from '../../../../core/model/establishment/Hotel';
import { HotelService } from '../../service/hotel-service';

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
  hotels: Hotel[] = [];

  constructor(
    private modalService: NzModalService,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  /**
   * Carga la lista de hoteles desde el servicio
   */
  private loadHotels(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (data:Hotel[]) => {
        this.hotels = data;
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
    this.modalService.create({
      nzTitle: 'Crear Hotel',
      nzContent: CreateHotelForm,
    });
  }
}
