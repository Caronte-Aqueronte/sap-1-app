import { Routes } from '@angular/router';
import { AdminDashBoard } from './features/dashboard/admin/page/admin-dash-board/admin-dash-board';
import { StaffDashBoard } from './features/dashboard/staff/page/staff-dash-board/staff-dash-board';
import { HotelDetailPage } from './features/hotel/page/hotel-detail-page/hotel-detail-page';
import { HotelsPage } from './features/hotel/page/hotels-page/hotels-page';
import { LandingPage } from './features/landing/page/landing-page/landing-page';
import { LoginPage } from './features/login/page/login-page/login-page';
import { RestaurantDetailPage } from './features/restaurant/page/restaurant-detail-page/restaurant-detail-page';
import { RestaurantPage } from './features/restaurant/page/restaurant-page/restaurant-page';
import { SearchResultsComponent } from './features/booking/page/search-results-component/search-results-component';
import { RoomBookingDetail } from './features/booking/page/room-booking-detail/room-booking-detail';
import { InfoSection } from './features/landing/component/info-section/info-section';
import { HotelsExplorePage } from './features/hotel/page/hotels-explore-page/hotels-explore-page';
import { HotelRoomsPage } from './features/hotel/page/hotel-rooms-page/hotel-rooms-page';
import { RoomDetailPage } from './features/room/page/room-detail-page/room-detail-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },

  {
    path: 'landing',
    component: LandingPage,
    children: [
      { path: 'search-results', component: SearchResultsComponent },
      { path: 'room-booking-detail/:id', component: RoomBookingDetail },
      { path: 'hotels-explore', component: HotelsExplorePage },
      { path: 'hotel/:id/rooms', component: HotelRoomsPage },
      { path: 'room-detail/:id', component: RoomDetailPage },
      { path: 'info-section', component: InfoSection },
      { path: '', redirectTo: 'info-section', pathMatch: 'full' },
    ],
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
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'landing',
  },
];
