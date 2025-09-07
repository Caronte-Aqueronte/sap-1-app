import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { PromotionRestaurant } from '../../../model/PromotionRestaurant';
import { PromotionRestaurantService } from '../../../service/promotion-restaurant-service';
import { ErrorRenderService } from '../../../../../core/services/error-render-service';
import { CreateRestaurantPromotionForm } from '../create-restaurant-promotion-form/create-restaurant-promotion-form';

@Component({
  selector: 'app-restaurant-promotions-page',
  standalone: true,
  imports: [
    NzPageHeaderModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzModalModule,
    NgClass,
  ],
  templateUrl: './restaurant-promotions-page.html',
  styleUrl: './restaurant-promotions-page.css',
})
export class RestaurantPromotionsPage implements OnInit {
  promotions: PromotionRestaurant[] = [];

  constructor(
    private promotionRestaurantService: PromotionRestaurantService,
    private cdr: ChangeDetectorRef,
    private errorRender: ErrorRenderService,
    private toast: ToastrService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  /**
   * Carga las promociones de restaurantes
   */
  private loadPromotions(): void {
    this.promotionRestaurantService.getAll().subscribe({
      next: (data: PromotionRestaurant[]) => {
        this.promotions = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.toast.error(this.errorRender.render(err.error)),
    });
  }

  onCreatePromotion(): void {
    const modal = this.modalService.create({
      nzTitle: 'Crear promoción de restaurante',
      nzContent: CreateRestaurantPromotionForm,
      nzCentered: true,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.loadPromotions();
      }
    });
  }

  onEditPromotion(promo: PromotionRestaurant): void {
    // TODO: implementar edición
    console.log('Editar promoción restaurante', promo);
  }
}
