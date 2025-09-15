import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Restaurant } from '../../model/Restaurant';
import { HotelService } from '../../../hotel/service/hotel-service';
import { Router } from '@angular/router';
import { RestaurantService } from '../../service/restaurant-service';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { ToastrService } from 'ngx-toastr';
import { CreateRestaurantForm } from '../create-restaurant-form/create-restaurant-form';
import { EditRestaurantForm } from '../edit-restaurant-form/edit-restaurant-form';

@Component({
  selector: 'app-restaurant-page',
  imports: [
    NzDividerModule,
    NzTableModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzModalModule,
  ],
  templateUrl: './restaurant-page.html',
  styleUrl: './restaurant-page.css',
})
export class RestaurantPage implements OnInit {
  restaurants: Restaurant[] = [];

  constructor(
    private modalService: NzModalService,
    private restaurantService: RestaurantService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private render: ErrorRenderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadRestaurant();
  }

  /**
   * Carga la lista de hoteles desde el servicio
   */
  private loadRestaurant(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data: Restaurant[]) => {
        this.restaurants = data;
        this.cdr.detectChanges(); //regresca cambios
      },
      error: (err) => {
        this.toastr.error(this.render.render(err.error));
      },
    });
  }

  onCreateRestaurant() {
    const modal = this.modalService.create({
      nzTitle: 'Crear Restaurante',
      nzContent: CreateRestaurantForm,
      nzCentered: true,
    });

    //espera a que se cierre el modal, si se lanza un sicces entonces manda a traer todos los hoteles
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.loadRestaurant();
      }
    });
  }

  onViewRestaurant(rest: Restaurant) {
    this.router.navigate(['/dashboard/admin/restaurant-detail', rest.id]);
  }

  onUpdateRestaurant(rest: Restaurant) {
    const modal = this.modalService.create({
      nzTitle: 'Editar Restaurante',
      nzContent: EditRestaurantForm,
      nzData: {
        rest: rest, // se pasa el rest como input
      },
      nzCentered: true,
    });

    //espera a que se cierre el modal, si se lanza un sicces entonces manda a traer todos los hoteles
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.loadRestaurant();
      }
    });
  }
}
