import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Hotel } from '../../../hotel/model/Hotel';
import { Router, RouterOutlet } from '@angular/router';
import { HotelService } from '../../../hotel/service/hotel-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-landing-page',
  imports: [
    NzSelectModule,
    NzDatePickerModule,
    NzIconModule,
    NzGridModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzFormModule,
    RouterOutlet,
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  constructor(
    private router: Router,
    private hotelService: HotelService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService
  ) {}

  goBookings() {
    this.router.navigate(['/landing']);
  }
  goLogin() {
    this.router.navigate(['/login']);
  }

  goHotels() {
    this.router.navigate(['/landing/hotels-explore']);
  }
}
