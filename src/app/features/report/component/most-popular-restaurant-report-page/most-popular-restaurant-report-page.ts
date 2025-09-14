import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Restaurant } from '../../../restaurant/model/Restaurant';
import { ReportService } from '../../service/report-service';
import { ToastrService } from 'ngx-toastr';
import { RestaurantService } from '../../../restaurant/service/restaurant-service';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { MostPopularRestaurantReport } from '../../model/MostPopularRestaurantReport';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

@Component({
  selector: 'app-most-popular-restaurant-report-page',
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
  templateUrl: './most-popular-restaurant-report-page.html',
  styleUrl: './most-popular-restaurant-report-page.css',
})
export class MostPopularRestaurantReportPage implements OnInit {
  establishments: Restaurant[] = [];
  selectedEstablishmentId: string | null = null;
  mostPopularRestaurantReport: MostPopularRestaurantReport | null = null;

  constructor(
    private reportService: ReportService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private restaurantService: RestaurantService,
    private render: ErrorRenderService
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  private loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (establishments: Restaurant[]) => {
        this.establishments = establishments;
        this.cdr.detectChanges();
      },
      error: (err) => this.toastr.error(this.render.render(err.error)),
    });
  }

  onQuery(): void {
    this.reportService
      .getMostPopularRestaurantReport({
        restaurantId: this.selectedEstablishmentId,
      })
      .subscribe({
        next: (rep) => {
          this.mostPopularRestaurantReport = rep;
          this.cdr.detectChanges();
        },
        error: (err) => this.toastr.error(this.render.render(err.error)),
      });
  }

  onExport(): void {
    this.reportService
      .exportMostPopularRestaurantReport({
        restaurantId: this.selectedEstablishmentId,
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
