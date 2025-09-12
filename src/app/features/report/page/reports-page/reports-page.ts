import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { Establishment } from '../../../establishment/model/Establishment';
import { EstablishmentService } from '../../../establishment/service/establishment-service';
import { HotelService } from '../../../hotel/service/hotel-service';
import { RestaurantService } from '../../../restaurant/service/restaurant-service';
import { IncomeReport } from '../../model/IncomeReport';
import { ReportService } from '../../service/report-service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    NzPageHeaderModule,
    NzIconModule,
    NzDividerModule,
    NzButtonModule,
    NzTableModule,
    NzTabsModule,
    NzSelectModule,
    NzDatePickerModule,
    FormsModule,
  ],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.css',
})
export class ReportsPage implements OnInit {
  establishments: Establishment[] = [];
  selectedEstablishmentId: string | null = null;
  dateRange: Date[] = [];

  incomeReport: IncomeReport | null = null;

  private hotelService = inject(HotelService);
  private restaurantService = inject(RestaurantService);

  constructor(
    private reportService: ReportService,
    private toastr: ToastrService,
    private errorRender: ErrorRenderService,
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

  /**
   * Obtiene la fecha inicial del rango en formato YYYY-MM-DD
   */
  private get startDate(): string | null {
    const [start] = this.dateRange ?? [];
    return start ? new Date(start).toISOString().split('T')[0] : null;
  }

  /**
   * Obtiene la fecha final del rango en formato YYYY-MM-DD
   */
  private get endDate(): string | null {
    const [, end] = this.dateRange ?? [];
    return end ? new Date(end).toISOString().split('T')[0] : null;
  }

  onQueryIncomeReport(): void {
    if (!this.selectedEstablishmentId) {
      this.toastr.error('Seleccione un establecimiento');
      return;
    }
    if (!this.startDate || !this.endDate) {
      this.toastr.error('Seleccione un rango de fechas');
      return;
    }

    this.reportService
      .getIncomeReport({
        establishmentId: this.selectedEstablishmentId,
        startDate: this.startDate!,
        endDate: this.endDate!,
      })
      .subscribe({
        next: (rep) => {
          this.incomeReport = rep;
          this.cdr.detectChanges();
        },
        error: (err) => this.toastr.error(this.errorRender.render(err.error)),
      });
  }

  onExportIncomeReport(): void {
    if (!this.selectedEstablishmentId || !this.startDate || !this.endDate) {
      this.toastr.error('Complete establecimiento y fechas');
      return;
    }
    this.reportService
      .exportIncomeReport({
        establishmentId: this.selectedEstablishmentId,
        startDate: this.startDate!,
        endDate: this.endDate!,
      })
      .subscribe({
        next: (resp) => {
          const blob = new Blob([resp.body as BlobPart], {
            type: 'application/pdf',
          });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        error: (err) => this.toastr.error(this.errorRender.render(err.error)),
      });
  }
}
