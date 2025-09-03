import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { Router } from '@angular/router';
import { Hotel } from '../../model/Hotel';
import { HotelService } from '../../service/hotel-service';
import { HotelCard } from '../../component/hotel-card/hotel-card';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hotels-explore-page',
  standalone: true,
  imports: [NzPageHeaderModule, HotelCard],
  templateUrl: './hotels-explore-page.html',
  styleUrl: './hotels-explore-page.css',
})
export class HotelsExplorePage implements OnInit {

  hotels: Hotel[] = [];

  constructor(
    private hotelService: HotelService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private render: ErrorRenderService,
    private toatr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getHotels();
  }

  getHotels() {
    this.hotelService.getAllHotels().subscribe({
      next: (hotels: Hotel[]) => {
        this.hotels = hotels;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toatr.error(this.render.render(err.error));
      },
    });
  }

  goToHotelRooms(hotel: Hotel) {
    this.router.navigate(['/landing/hotel', hotel.id, 'rooms']);
  }
}
