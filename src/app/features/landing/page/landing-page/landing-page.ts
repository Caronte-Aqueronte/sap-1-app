import { Component, inject } from '@angular/core';
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
import { Router } from '@angular/router';
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
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  hotels: Hotel[] = [];

  private fb = inject(NonNullableFormBuilder);

  bookingSearchForm = this.fb.group({
    hotel: [null, [Validators.required]],
    checkIn: [null, [Validators.required]],
    checkOut: [null, [Validators.required]],
  });

  constructor(private router: Router) {}
  goLogin() {
    this.router.navigate(['/login']);
  }
  search() {
    throw new Error('Method not implemented.');
  }
}
