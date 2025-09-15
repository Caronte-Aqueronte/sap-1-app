import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Restaurant } from '../../model/Restaurant';

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './restaurant-card.html',
})
export class RestaurantCard {
  @Input({ required: true }) restaurant!: Restaurant;
  @Output() view = new EventEmitter<Restaurant>();

  onView() {
    this.view.emit(this.restaurant);
  }
}

