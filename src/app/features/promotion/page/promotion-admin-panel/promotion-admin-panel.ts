import { Component } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RoomPromotionsPage } from '../rooms-promotion/room-promotions-page/room-promotions-page';
import { ClientPromotionsPage } from "../client-promotion/client-promotions-page/client-promotions-page";
import { RestaurantPromotionsPage } from "../restaurant-promotion/restaurant-promotions-page/restaurant-promotions-page";

@Component({
  selector: 'app-promotion-admin-panel',
  standalone: true,
  imports: [NzTabsModule, NzIconModule, RoomPromotionsPage, ClientPromotionsPage, RestaurantPromotionsPage],
  templateUrl: './promotion-admin-panel.html',
  styleUrl: './promotion-admin-panel.css',
})
export class PromotionAdminPanel {}
