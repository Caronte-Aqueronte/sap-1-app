import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { RestaurantService } from '../../service/restaurant-service';
import { Restaurant } from '../../model/Restaurant';
import { RestaurantCard } from '../../component/restaurant-card/restaurant-card';
import { Router } from '@angular/router';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-restaurants-explore-page',
  standalone: true,
  imports: [NzPageHeaderModule, RestaurantCard],
  templateUrl: './restaurants-explore-page.html',
})
export class RestaurantsExplorePage implements OnInit {
  restaurants: Restaurant[] = [];

  constructor(
    private restaurantService: RestaurantService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private renderService: ErrorRenderService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllRestaurants();
  }
  /**
   * obtiene todos los restaurantes desde el servicio
   * asigna el resultado a la lista local y actualiza la vista
   */
  private getAllRestaurants() {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.cdr.detectChanges();
      },
      error: (err) =>
        this.toastrService.error(this.renderService.render(err.error)),
    });
  }

  /**
   * navega a la vista de detalle de un restaurante
   *
   * @param restaurant entidad restaurante seleccionada
   */
  onView(restaurant: Restaurant) {
    this.router.navigate(['/landing/restaurant', restaurant.id, 'detail']);
  }
}
