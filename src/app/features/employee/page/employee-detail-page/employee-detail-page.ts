import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { Employee } from '../../model/Employee';
import { EmployeeService } from '../../service/employee-service';
import { CreatePaymentForm } from '../create-payment-form/create-payment-form';

@Component({
  selector: 'app-employee-detail-page',
  standalone: true,
  imports: [
    NzPageHeaderModule,
    NzIconModule,
    NzDividerModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
  ],
  templateUrl: './employee-detail-page.html',
})
export class EmployeeDetailPage implements OnInit {
  employee: Employee | null = null;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private errorRender: ErrorRenderService,
    private modalService: NzModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployee();
  }

  private loadEmployee() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastr.error('No se proporcionó un ID de empleado');
      return;
    }
    this.employeeService.getById(id).subscribe({
      next: (data) => {
        this.employee = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }

  onCreatePayment(): void {
    if (!this.employee) return;
    const modal = this.modalService.create({
      nzTitle: 'Nuevo pago',
      nzContent: CreatePaymentForm,
      nzData: {
        employeeId: this.employee.id,
        employeeName: `${this.employee.firstName} ${this.employee.lastName}`,
        employee: this.employee,
      },
      nzCentered: true,
      nzWidth: 520,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.loadEmployee();
      }
    });
  }
}
