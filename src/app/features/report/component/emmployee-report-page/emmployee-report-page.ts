import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { Establishment } from '../../../establishment/model/Establishment';
import { EstablishmentService } from '../../../establishment/service/establishment-service';
import { EmployeeReport } from '../../model/EmployeeReport';
import { ReportService } from '../../service/report-service';
@Component({
  selector: 'app-emmployee-report-page',
  imports: [
    NzPageHeaderModule,
    NzIconModule,
    NzDividerModule,
    NzButtonModule,
    NzTableModule,
    NzTabsModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputModule,
    FormsModule,
    CommonModule,
    NzCollapseModule,
  ],
  templateUrl: './emmployee-report-page.html',
  styleUrl: './emmployee-report-page.css',
})
export class EmmployeeReportPage implements OnInit {
  employeeReport: EmployeeReport | null = null;
  establishments: Establishment[] = [];
  selectedEstablishmentId: string | null = null;

  constructor(
    private reportService: ReportService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private establishmentService: EstablishmentService,
    private render: ErrorRenderService
  ) {}
  ngOnInit(): void {
    this.loadEstablishments();
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

  onQueryEmployeeReport(): void {
    this.reportService
      .getEmployeeReport({ establishmentId: this.selectedEstablishmentId })
      .subscribe({
        next: (report: EmployeeReport) => {
          this.employeeReport = report;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.toastr.error(this.render.render(err.error));
        },
      });
  }

  onExportEmployeeReport(): void {
    this.reportService
      .exportEmployeeReport({ establishmentId: this.selectedEstablishmentId })
      .subscribe({
        next: (response) => {
          const blob = new Blob([response.body as BlobPart], {
            type: 'application/pdf',
          });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        error: (err) => {
          this.toastr.error(this.render.render(err.error));
        },
      });
  }
}
