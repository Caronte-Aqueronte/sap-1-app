import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzInputModule } from 'ng-zorro-antd/input';
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
import { StayDiningReport } from '../../model/StayDiningReport';
import { ReportService } from '../../service/report-service';
import { Client } from '../../../client/model/Client';
import { ClientService } from '../../../client/service/client-service';
import { IncomeReportPage } from "../../component/income-report-page/income-report-page";
import { StayDiningReportPage } from "../../component/stay-dining-report-page/stay-dining-report-page";
import { EmmployeeReportPage } from "../../component/emmployee-report-page/emmployee-report-page";
import { MostPopularRoomReportPage } from "../../component/most-popular-room-report-page/most-popular-room-report-page";

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
    NzInputModule,
    FormsModule,
    IncomeReportPage,
    StayDiningReportPage,
    EmmployeeReportPage,
    MostPopularRoomReportPage
],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.css',
})
export class ReportsPage {}
