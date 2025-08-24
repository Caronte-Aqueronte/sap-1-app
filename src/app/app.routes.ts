import { Routes } from '@angular/router';
import { LoginPage } from './features/login/page/login-page/login-page';
import { AdminDashBoard } from './features/dashboard/admin/page/admin-dash-board/admin-dash-board';
import { StaffDashBoard } from './features/dashboard/staff/page/staff-dash-board/staff-dash-board';
import { HotelsPage } from './features/hotel/page/hotels-page/hotels-page';

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
        children: [{ path: 'hotel', component: HotelsPage }],
      },
      { path: 'staff', component: StaffDashBoard },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
