import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { Client } from '../../../client/model/Client';
import { ClientService } from '../../../client/service/client-service';
import { Establishment } from '../../../establishment/model/Establishment';
import { EstablishmentService } from '../../../establishment/service/establishment-service';
import { ReportService } from '../../service/report-service';
import { StayDiningReport } from '../../model/StayDiningReport';
import { DateUtil } from '../../../../core/util/DateUtil.';

@Component({
  selector: 'app-stay-dining-report-page',
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
  templateUrl: './stay-dining-report-page.html',
  styleUrl: './stay-dining-report-page.css',
})
export class StayDiningReportPage implements OnInit {
  establishments: Establishment[] = [];
  clients: Client[] = [];
  dateRange: Date[] = [];
  selectedClientId: string | null = null;
  selectedEstablishmentId: string | null = null;

  stayDiningReport: StayDiningReport | null = null;

  constructor(
    private reportService: ReportService,
    private toastr: ToastrService,
    private render: ErrorRenderService,
    private cdr: ChangeDetectorRef,
    private establishmentService: EstablishmentService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadEstablishments();
    this.laodClients();
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

  private laodClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients: Client[]) => {
        this.clients = clients;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.render.render(err.error)),
    });
  }

  /**
   * Obtiene la fecha inicial del rango en formato YYYY-MM-DD
   */
  private get startDate(): string | null {
    const [start] = this.dateRange ?? [];
    return start ? DateUtil.format(start) : null;
  }
  /**
   * Obtiene la fecha final del rango en formato YYYY-MM-DD
   */
  private get endDate(): string | null {
    const [, end] = this.dateRange ?? [];
    return end ? DateUtil.format(end) : null;
  }

  onQueryStayDiningReport(): void {
    if (!this.selectedClientId) {
      this.toastr.error('Seleccione un cliente');
      return;
    }
    if (!this.startDate || !this.endDate) {
      this.toastr.error('Seleccione un rango de fechas');
      return;
    }

    this.reportService
      .getStayDiningReport({
        clientId: this.selectedClientId,
        startDate: this.startDate,
        endDate: this.endDate,
        establishmentId: this.selectedEstablishmentId,
      })
      .subscribe({
        next: (rep) => {
          this.stayDiningReport = rep;
          this.cdr.detectChanges();
        },
        error: (err) => this.toastr.error(this.render.render(err.error)),
      });
  }

  onExportStayDiningReport() {
    if (!this.selectedClientId) {
      this.toastr.error('Seleccione un cliente');
      return;
    }
    if (!this.startDate || !this.endDate) {
      this.toastr.error('Seleccione un rango de fechas');
      return;
    }

    this.reportService
      .exportStayDiningReport({
        clientId: this.selectedClientId,
        startDate: this.startDate,
        endDate: this.endDate,
        establishmentId: this.selectedEstablishmentId,
      })
      .subscribe({
        next: (resp) => {
          const blob = new Blob([resp.body as BlobPart], {
            type: 'application/pdf',
          });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        error: (err) => this.toastr.error(this.render.render(err.error)),
      });
  }

  get stayDiningTotal(): number {
    if (!this.stayDiningReport) return 0;
    return this.stayDiningReport.items.reduce(
      (sum, it) => sum + (it.amount || 0),
      0
    );
  }
}
