import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';

import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../../core/services/error-render-service';
import { PromotionRoom } from '../../../model/PromotionRoom';
import { PromotionRoomService } from '../../../service/promotion-room-service';
import { CreateRoomPromotionForm } from '../create-room-promotion-form/create-room-promotion-form';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-room-promotions-page',
  standalone: true,
  imports: [
    NzPageHeaderModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzModalModule,
    NzTagModule
  ],
  templateUrl: './room-promotions-page.html',
  styleUrl: './room-promotions-page.css',
})
export class RoomPromotionsPage implements OnInit {
  promotions: PromotionRoom[] = [];

  constructor(
    private promotionRoomService: PromotionRoomService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private errorRender: ErrorRenderService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  /**
   * Consulta al backend todas las promociones de habitación
   */
  private loadPromotions(): void {
    this.promotionRoomService.getAll().subscribe({
      next: (data: PromotionRoom[]) => {
        this.promotions = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }

  /**
   * Abre el modal para crear una nueva promoción de habitación
   */
  onCreatePromotion(): void {
    const modal = this.modalService.create({
      nzTitle: 'Crear promoción de habitación',
      nzContent: CreateRoomPromotionForm,
      nzCentered: true,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.loadPromotions();
      }
    });
  }

  onEditPromotion(promo: PromotionRoom): void {
    console.log('Editar promoción de habitación', promo);
  }
}
