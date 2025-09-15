import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { RestaurantService } from '../../service/restaurant-service';
import { MenuItem } from '../../../menuItem/model/MenuItem';
import { MenuItemService } from '../../../menuItem/service/menu-item-service';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { ToastrService } from 'ngx-toastr';
import { Restaurant } from '../../model/Restaurant';
import { EditMenuItemForm } from '../../../menuItem/page/edit-menu-item-form/edit-menu-item-form';
import { CreateMenuItemForm } from '../../../menuItem/page/create-menu-item-form/create-menu-item-form';

@Component({
  selector: 'app-restaurant-detail-page',
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
  templateUrl: './restaurant-detail-page.html',
  styleUrl: './restaurant-detail-page.css',
})
export class RestaurantDetailPage {
  menu: MenuItem[] = [];
  rest!: Restaurant;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private menuItemService: MenuItemService,
    private errorRender: ErrorRenderService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.getRestaurantById();
    this.getMenuByRestaurantId();
  }

  /**
   * Obtiene la información del rest actual a partir del parámetro de ruta `id`.
   */
  private getRestaurantById() {
    const id = this.route.snapshot.paramMap.get('id')!; //obteiene id de la ruta
    this.restaurantService.getRestaurantById(id).subscribe({
      next: (rest: Restaurant) => {
        this.rest = rest;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }

  /**
   * Obtiene todas las habitaciones asociadas a un hotel específico.
   */
  private getMenuByRestaurantId(): void {
    const id = this.route.snapshot.paramMap.get('id')!; //obteiene id de la ruta

    this.menuItemService.getAllByRestaurantId(id).subscribe({
      next: (menu: MenuItem[]) => {
        this.menu = menu;
        this.cdr.detectChanges(); //regresca cambios
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }

  /**
   * Abre el modal de creacion de una habitacion
   */
  onCreateMenuItem() {
    const modal = this.modalService.create({
      nzTitle: 'Crear Platillo',
      nzContent: CreateMenuItemForm,
      nzData: {
        rest: this.rest,
      },
      nzCentered: true,
    });

    //espera a que se cierre el modal, si se lanza un sicces entonces manda a traer todas las habs
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getMenuByRestaurantId();
      }
    });
  }

  onUpdateMenuItem(menuItem: MenuItem) {
    const modal = this.modalService.create({
      nzTitle: 'Editar Platillo',
      nzContent: EditMenuItemForm,
      nzData: {
        item: menuItem,
      },
      nzCentered: true,
    });

    //espera a que se cierre el modal, si se lanza un sicces entonces manda a traer todos los hoteles
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getMenuByRestaurantId();
      }
    });
  }
}
