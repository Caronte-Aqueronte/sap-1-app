import { Routes } from '@angular/router';
import { LoginPage } from './features/login/page/login-page/login-page';
import { AdminDashBoard } from './features/dashboard/admin/page/admin-dash-board/admin-dash-board';
import { StaffDashBoard } from './features/dashboard/staff/page/staff-dash-board/staff-dash-board';
import { HotelsPage } from './features/hotel/page/hotels-page/hotels-page';
import { HotelDetailPage } from './features/hotel/page/hotel-detail-page/hotel-detail-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
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
        ],
      },
      { path: 'staff', component: StaffDashBoard },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
