import { Component } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ClientPromotionsPage } from '../client-promotions-page/client-promotions-page';

@Component({
  selector: 'app-promotion-admin-panel',
  standalone: true,
  imports: [NzTabsModule, NzIconModule, ClientPromotionsPage],
  templateUrl: './promotion-admin-panel.html',
  styleUrl: './promotion-admin-panel.css',
})
export class PromotionAdminPanel {}
