import { Routes } from '@angular/router';
import { AdminDashBoard } from './features/dashboard/admin/page/admin-dash-board/admin-dash-board';
import { StaffDashBoard } from './features/dashboard/staff/page/staff-dash-board/staff-dash-board';
import { HotelDetailPage } from './features/hotel/page/hotel-detail-page/hotel-detail-page';
import { HotelsPage } from './features/hotel/page/hotels-page/hotels-page';
import { LandingPage } from './features/landing/page/landing-page/landing-page';
import { LoginPage } from './features/login/page/login-page/login-page';
import { RestaurantDetailPage } from './features/restaurant/page/restaurant-detail-page/restaurant-detail-page';
import { RestaurantPage } from './features/restaurant/page/restaurant-page/restaurant-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },

  {
    path: 'landing',
    component: LandingPage,
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },

  {
    path: 'dashboard',
    children: [
      {
        path: 'admin',
        component: AdminDashBoard,
        children: [
          { path: 'hotel', component: HotelsPage },
          {
            path: 'hotel-detail/:id',
            component: HotelDetailPage,
          },

          { path: 'restaurant', component: RestaurantPage },
          { path: 'restaurant-detail/:id', component: RestaurantDetailPage },
        ],
      },
      { path: 'staff', component: StaffDashBoard },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
