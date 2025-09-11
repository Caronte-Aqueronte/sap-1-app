import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import { NzModalModule, NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { EmployeeService } from '../../service/employee-service';
import { Establishment } from '../../../establishment/model/Establishment';
import { SaveEmployeeRequestDTO } from '../../model/SaveEmployeeRequestDTO';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Employee } from '../../model/Employee';

@Component({
  selector: 'app-create-employee-form',
  standalone: true,
  imports: [
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './create-employee-form.html',
})
export class CreateEmployeeForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    establishmentId: ['', [Validators.required]],
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    nationalId: [
      '',
      [Validators.required, Validators.maxLength(13), Validators.minLength(13)],
    ],
    salary: [1, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private modal: NzModalRef,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private errorRender: ErrorRenderService,
    private cdr: ChangeDetectorRef,
    @Inject(NZ_MODAL_DATA)
    public data: {
      establishments: Establishment[];
      employee?: Employee;
      updateMode: boolean;
    }
  ) {}

  ngOnInit(): void {
    if (this.data?.employee && this.data.updateMode) {
      const employee = this.data.employee;
      this.form.patchValue({
        establishmentId: employee.establishmentId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        nationalId: employee.nationalId,
        salary: employee.salary,
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('Complete los datos del empleado');
      return;
    }

    if (this.data.updateMode) {
      this.onUpdate();
    } else {
      this.onCreate();
    }
  }

  private onUpdate() {
    if (!this.data.employee?.id) {
      this.form.markAllAsTouched();
      this.toastr.error('No se pudo determinar el empleado a editar.');
      return;
    }

    this.employeeService
      .update(this.form.getRawValue(), this.data.employee.id)
      .subscribe({
        next: () => {
          this.toastr.success('Empleado editado con exito');
          this.modal.destroy(true);
        },
        error: (err) => this.toastr.error(this.errorRender.render(err.error)),
      });
  }

  private onCreate() {
    this.employeeService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.toastr.success('Empleado creado con exito');
        this.modal.destroy(true);
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }
}
