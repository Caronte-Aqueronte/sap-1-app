import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { PromotionBaseForm } from '../../../component/promotion-base-form/promotion-base-form';
import { PromotionClientService } from '../../../service/promotion-client-service';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../../core/services/error-render-service';
import { PromotionClient } from '../../../model/PromotionClient';
import { SavePromotionClientRequestDTO } from '../../../model/request/SavePromotionClientRequestDTO';
import { format } from 'date-fns';

@Component({
  selector: 'app-edit-client-promotion-form',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzButtonModule,
    NzModalModule,
    PromotionBaseForm,
  ],
  templateUrl: './edit-client-promotion-form.html',
  styleUrl: './edit-client-promotion-form.css',
})
export class EditClientPromotionForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private promotion!: PromotionClient;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    discountPercent: [
      1,
      [Validators.required, Validators.min(1), Validators.max(100)],
    ],
    startDate: [null as Date | null, [Validators.required]],
    endDate: [null as Date | null, [Validators.required]],
    minVisits: [1, [Validators.required, Validators.min(1)]],
  });

  constructor(
    private modal: NzModalRef,
    private promotionClientService: PromotionClientService,
    private toastr: ToastrService,
    private errorRender: ErrorRenderService,
    @Inject(NZ_MODAL_DATA) public data: { promotion: PromotionClient }
  ) {
    this.promotion = data.promotion;
    this.form.patchValue(this.promotion);
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('Formulario inválido, revisa los campos');
      return;
    }

    const formValue = this.form.getRawValue();

    const request: SavePromotionClientRequestDTO = {
      name: formValue.name.trim(),
      discountPercent: formValue.discountPercent,
      startDate: format(formValue.startDate!, "yyyy-MM-dd'T'HH:mm:ss"),
      endDate: format(formValue.endDate!, "yyyy-MM-dd'T'HH:mm:ss"),
      minVisits: formValue.minVisits,
    };

    this.promotionClientService.edit(request, this.promotion.id).subscribe({
      next: () => {
        this.toastr.success('Promoción editada exitosamente');
        this.modal.destroy(true);
      },
      error: (err) => {
        this.toastr.error(this.errorRender.render(err.error));
      },
    });
  }
}
