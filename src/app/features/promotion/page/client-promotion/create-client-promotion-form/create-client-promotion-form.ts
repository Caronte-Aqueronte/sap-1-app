import { Component, inject } from '@angular/core';
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
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../../core/services/error-render-service';
import { PromotionBaseForm } from '../../../component/promotion-base-form/promotion-base-form';
import { SavePromotionClientRequestDTO } from '../../../model/request/SavePromotionClientRequestDTO';
import { PromotionClientService } from '../../../service/promotion-client-service';

@Component({
  selector: 'app-create-client-promotion-form',
  standalone: true,
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
  templateUrl: './create-client-promotion-form.html',
})
export class CreateClientPromotionForm {
  private fb = inject(NonNullableFormBuilder);

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
    private errorRender: ErrorRenderService
  ) {}

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
      startDate: formValue.startDate!.toISOString(),
      endDate: formValue.endDate!.toISOString(),
      minVisits: formValue.minVisits,
    };

    this.promotionClientService.create(request).subscribe({
      next: () => {
        this.toastr.success('Promoción creada exitosamente');
        this.modal.destroy(true);
      },
      error: (err) => {
        this.toastr.error(this.errorRender.render(err.error));
        console.error('Error creando promoción de cliente', err);
      },
    });
  }

}
