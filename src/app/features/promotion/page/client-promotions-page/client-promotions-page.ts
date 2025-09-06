import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NgClass } from '@angular/common';

import { PromotionClient } from '../../../promotion/model/PromotionClient';
import { PromotionClientService } from '../../../promotion/service/promotion-client-service';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { ToastrService } from 'ngx-toastr';
import { CreateClientPromotionForm } from '../create-client-promotion-form/create-client-promotion-form';

@Component({
  selector: 'app-client-promotions-page',
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
  templateUrl: './client-promotions-page.html',
  styleUrl: './client-promotions-page.css',
})
export class ClientPromotionsPage implements OnInit {
  promotions: PromotionClient[] = [];

  constructor(
    private promotionClientService: PromotionClientService,
    private cdr: ChangeDetectorRef,
    private erroRender: ErrorRenderService,
    private toast: ToastrService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  /**
   * Carga todas las promociones disponibles
   */
  private loadPromotions(): void {
    this.promotionClientService.getAll().subscribe({
      next: (data: PromotionClient[]) => {
        this.promotions = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.toast.error(this.erroRender.render(err.error)),
    });
  }

  /**
   * Carga el dialog de creacion
   */
  onCreatePromotion(): void {
    const modal = this.modalService.create({
      nzTitle: 'Crear promoción de cliente frecuente',
      nzContent: CreateClientPromotionForm,
      nzCentered: true,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.loadPromotions();
      }
    });
  }

  onEditPromotion(promo: PromotionClient): void {
    console.log('Editar promoción', promo);
  }

  onViewPromotion(promo: PromotionClient): void {
    console.log('Ver promoción', promo);
  }
}
