import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { Order } from '../../model/Order';
import { OrderService } from '../../service/order-service';
import { CreateOrderDialog } from '../create-order-dialog/create-order-dialog';
import { Restaurant } from '../../../restaurant/model/Restaurant';
import { RestaurantService } from '../../../restaurant/service/restaurant-service';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    NzDividerModule,
    NzTableModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzModalModule,
    NzSelectModule,
    FormsModule,
  ],
  templateUrl: './order-page.html',
})
export class OrderPage implements OnInit {
  orders: Order[] = [];
  restaurants: Restaurant[] = [];
  selectedRestaurantId: string | null = null;

  private restaurantService = inject(RestaurantService);

  constructor(
    private modalService: NzModalService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private render: ErrorRenderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadOrders();
  }

  /** Carga la lista de órdenes creadas desde el servicio */
  private loadOrders(): void {
    this.orderService.getAll(this.selectedRestaurantId).subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.render.render(err.error)),
    });
  }

  /** Carga todos los restaurantes para el filtro */
  private loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data: Restaurant[]) => {
        this.restaurants = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.render.render(err.error)),
    });
  }

  /** Abre el diálogo para crear una nueva orden */
  onCreateOrder() {
    const modal = this.modalService.create({
      nzTitle: 'Crear orden',
      nzContent: CreateOrderDialog,
      nzCentered: true,
      nzWidth: 900,
    });
    modal.afterClose.subscribe((result) => {
      if (result) this.loadOrders();
    });
  }

  onViewOrder(order: Order) {
    this.router.navigate(['/dashboard/staff/orders', order.id]);
  }

  /** Maneja el cambio de restaurante en el filtro */
  onRestaurantChange(restaurantId: string | null): void {
    this.selectedRestaurantId = restaurantId;
    this.loadOrders();
  }
}
