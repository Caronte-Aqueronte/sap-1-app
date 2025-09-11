import {
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
  OnInit,
} from '@angular/core';
import { NzModalModule, NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { PaymentService } from '../../service/payment-service';
import { SavePaymentRequestDTO } from '../../model/SavePaymentRequestDTO';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Employee } from '../../model/Employee';

@Component({
  selector: 'app-create-payment-form',
  standalone: true,
  imports: [
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
  ],
  templateUrl: './create-payment-form.html',
})
export class CreatePaymentForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    amount: [1, [Validators.required, Validators.min(1)]],
    payedAt: [null as Date | null],
  });

  constructor(
    private modal: NzModalRef,
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private errorRender: ErrorRenderService,
    private cdr: ChangeDetectorRef,
    @Inject(NZ_MODAL_DATA)
    public data: {
      employeeId: string;
      employeeName: string;
      employee: Employee;
    }
  ) {}

  ngOnInit(): void {
    this.form.patchValue({ amount: this.data.employee.salary });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('Complete los datos del pago');
      return;
    }

    const formVaule = this.form.getRawValue();

    const body: SavePaymentRequestDTO = {
      employeeId: this.data.employeeId,
      amount: formVaule.amount,
      payedAt: formVaule.payedAt
        ? new Date(formVaule.payedAt).toISOString().split('T')[0]
        : null,
    };

    this.paymentService.create(body).subscribe({
      next: () => {
        this.toastr.success('Pago registrado con exito');
        this.modal.destroy(true);
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }
}
