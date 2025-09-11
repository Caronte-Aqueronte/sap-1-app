import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { Establishment } from '../../../establishment/model/Establishment';
import { EstablishmentService } from '../../../establishment/service/establishment-service';
import { Employee } from '../../model/Employee';
import { EmployeeService } from '../../service/employee-service';
import { CreateEmployeeForm } from '../create-employee-form/create-employee-form';

@Component({
  selector: 'app-employees-page',
  standalone: true,
  imports: [
    NzDividerModule,
    NzTableModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzModalModule,
    NzSelectModule,
    FormsModule,
  ],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.css',
})
export class EmployeesPage implements OnInit {
  employees: Employee[] = [];
  establishments: Establishment[] = [];
  selectedEstablishmentId: string | null = null;

  constructor(
    private modalService: NzModalService,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private render: ErrorRenderService,
    private toastr: ToastrService,
    private establishmentService: EstablishmentService
  ) {}

  ngOnInit(): void {
    this.loadEstablishments();
    this.loadEmployees();
  }

  private loadEstablishments(): void {
    this.establishmentService.getAll().subscribe({
      next: (establishments: Establishment[]) => {
        this.establishments = establishments;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.render.render(err.error)),
    });
  }

  private loadEmployees(): void {
    this.employeeService
      .getAll(this.selectedEstablishmentId ?? undefined)
      .subscribe({
        next: (data: Employee[]) => {
          this.employees = data;
          this.cdr.detectChanges();
        },
        error: (err) => this.toastr.error(this.render.render(err.error)),
      });
  }

  onCreateEmployee(): void {
    const modal = this.modalService.create({
      nzTitle: 'Crear empleado',
      nzContent: CreateEmployeeForm,
      nzData: {
        establishments: this.establishments,
        updateMode: false,
      },
      nzCentered: true,
      nzWidth: 720,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  onViewEmployee(emp: Employee): void {
    this.router.navigate(['/dashboard/admin/employee', emp.id]);
  }

  onEditEmployee(emp: Employee): void {
    const modal = this.modalService.create({
      nzTitle: 'Editar empleado',
      nzContent: CreateEmployeeForm,
      nzData: {
        establishments: this.establishments,
        employee: emp,
        updateMode: true,
      },
      nzCentered: true,
      nzWidth: 720,
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  onEstablishmentChange(id: string | null): void {
    this.selectedEstablishmentId = id;
    this.loadEmployees();
    this.cdr.detectChanges();
  }
}
