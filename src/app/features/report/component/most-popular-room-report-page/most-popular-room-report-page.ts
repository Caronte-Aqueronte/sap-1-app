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
import { Establishment } from '../../../establishment/model/Establishment';
import { ReportService } from '../../service/report-service';
import { ToastrService } from 'ngx-toastr';
import { EstablishmentService } from '../../../establishment/service/establishment-service';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { MostPopularRoomReport } from '../../model/MostPopularRoomReport';
import { HotelService } from '../../../hotel/service/hotel-service';
import { Hotel } from '../../../hotel/model/Hotel';

@Component({
  selector: 'app-most-popular-room-report-page',
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
  templateUrl: './most-popular-room-report-page.html',
  styleUrl: './most-popular-room-report-page.css',
})
export class MostPopularRoomReportPage implements OnInit {
  establishments: Hotel[] = [];
  selectedEstablishmentId: string | null = null;
  mostPopularRoomReport: MostPopularRoomReport | null = null;

  constructor(
    private reportService: ReportService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private hotelService: HotelService,
    private render: ErrorRenderService
  ) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  private loadHotels(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (establishments: Hotel[]) => {
        this.establishments = establishments;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.render.render(err.error)),
    });
  }

  onQueryMostPopularRoomReport(): void {
    this.reportService
      .getMostPopularRoomReport({
        establishmentId: this.selectedEstablishmentId,
      })
      .subscribe({
        next: (rep) => {
          this.mostPopularRoomReport = rep;
          this.cdr.detectChanges();
        },
        error: (err) => this.toastr.error(this.render.render(err.error)),
      });
  }

  onExportMostPopularRoomReport(): void {
    this.reportService
      .exportMostPopularRoomReport({
        establishmentId: this.selectedEstablishmentId,
      })
      .subscribe({
        next: (rep) => {
          const blob = new Blob([rep.body as BlobPart], {
            type: 'application/pdf',
          });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        error: (err) => this.toastr.error(this.render.render(err.error)),
      });
  }
}
