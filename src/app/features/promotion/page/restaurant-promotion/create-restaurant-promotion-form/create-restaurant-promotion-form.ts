import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../../core/services/error-render-service';
import { PromotionBaseForm } from '../../../component/promotion-base-form/promotion-base-form';
import { ReviewService } from '../../../../review/service/review-service';
import { RestaurantPopularity } from '../../../../review/model/RestaurantPopularity';
import { PromotionRestaurantService } from '../../../service/promotion-restaurant-service';
import { SavePromotionRestaurantRequestDTO } from '../../../model/request/SavePromotionRestaurantRequestDTO';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzDividerModule } from 'ng-zorro-antd/divider';
@Component({
  selector: 'app-create-restaurant-promotion-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzModalModule,
    PromotionBaseForm,
    NzIconModule,
    FormsModule,
    NzRateModule,
    NzDividerModule
  ],
  templateUrl: './create-restaurant-promotion-form.html',
})
export class CreateRestaurantPromotionForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  popular!: RestaurantPopularity;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    discountPercent: [
      1,
      [Validators.required, Validators.min(1), Validators.max(100)],
    ],
    startDate: [null as Date | null, [Validators.required]],
    endDate: [null as Date | null, [Validators.required]],
  });

  constructor(
    private modal: NzModalRef,
    private reviewService: ReviewService,
    private promoRestaurantService: PromotionRestaurantService,
    private toastr: ToastrService,
    private errorRender: ErrorRenderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMostPopularRestaurant();
  }

  private loadMostPopularRestaurant(): void {
    this.reviewService.getRestaurantMostPopular().subscribe({
      next: (data:RestaurantPopularity) => {
        this.popular = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('Formulario inválido, revisa los campos');
      return;
    }

    if (!this.popular) {
      this.toastr.error('No se pudo determinar el restaurante más popular');
      return;
    }

    const formValue = this.form.getRawValue();

    const req: SavePromotionRestaurantRequestDTO = {
      name: formValue.name.trim(),
      discountPercent: formValue.discountPercent,
      startDate: formValue.startDate!.toISOString(),
      endDate: formValue.endDate!.toISOString(),
      restaurantId: this.popular.restaurantId,
    };

    this.promoRestaurantService.create(req).subscribe({
      next: () => {
        this.toastr.success('Promoción de restaurante creada');
        this.modal.destroy(true);
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }
}
