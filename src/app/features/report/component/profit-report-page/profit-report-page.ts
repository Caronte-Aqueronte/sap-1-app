import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
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
import { ProfitReport } from '../../model/ProfitReport';
import { ReportService } from '../../service/report-service';

@Component({
  selector: 'app-profit-report-page',
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
  ],
  templateUrl: './profit-report-page.html',
  styleUrl: './profit-report-page.css',
})
export class ProfitReportPage {
  profitReport: ProfitReport | null = null;
  constructor(
    private reportService: ReportService,
    private toastr: ToastrService,
    private render: ErrorRenderService,
    private cdr: ChangeDetectorRef
  ) {}

  onQuery() {
    this.reportService.getProfitReport().subscribe({
      next: (report: ProfitReport) => {
        this.profitReport = report;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.render.render(err.error)),
    });
  }

  onExport() {
    this.reportService.exportProfitReport().subscribe({
      next: (report) => {
        const blob = new Blob([report.body as BlobPart], {
          type: 'application/pdf',
        });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (err) => this.toastr.error(this.render.render(err.error)),
    });
  }
}
