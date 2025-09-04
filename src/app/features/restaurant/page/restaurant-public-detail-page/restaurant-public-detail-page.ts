import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { Restaurant } from '../../model/Restaurant';
import { RestaurantService } from '../../service/restaurant-service';
import { ReviewListSection } from '../../../review/component/review-list-section/review-list-section';
import { ReviewCommentForm } from '../../../review/component/review-comment-form/review-comment-form';

@Component({
  selector: 'app-restaurant-public-detail-page',
  standalone: true,
  imports: [NzPageHeaderModule, ReviewListSection, ReviewCommentForm],
  templateUrl: './restaurant-public-detail-page.html',
})
export class RestaurantPublicDetailPage implements OnInit {
  restaurant: Restaurant | null = null;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.restaurantService.getPublicRestaurantById(id).subscribe({
      next: (res) => {
        this.restaurant = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error obteniendo restaurante', err),
    });
  }
}
