import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { Order } from '../../model/Order';
import { OrderService } from '../../service/order-service';

@Component({
  selector: 'app-order-detail-page',
  standalone: true,
  imports: [
    NzPageHeaderModule,
    NzIconModule,
    NzDividerModule,
    NzTableModule,
    NzButtonModule,
  ],
  templateUrl: './order-detail-page.html',
})
export class OrderDetailPage implements OnInit {
  order: Order | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastr: ToastrService,
    private errorRender: ErrorRenderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  private loadOrder() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastr.error('No se proporcionó un ID de orden');
      return;
    }

    this.orderService.getById(id).subscribe({
      next: (data: Order) => {
        this.order = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }
}
