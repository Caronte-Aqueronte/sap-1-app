import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from '../../../../../core/services/auth-service';

@Component({
  selector: 'app-staff-dash-board',
  imports: [
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    NzButtonModule,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './staff-dash-board.html',
  styleUrl: './staff-dash-board.css',
})
export class StaffDashBoard {
  isCollapsed = false;
  protected readonly date = new Date();

  public userFirstName!: String;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const firstName: String = this.authService.getUserFirstName();
    this.userFirstName = firstName ?? 'Invitado';
  }

  /**
   * Maneja la accion de logout
   */
  public onLogout(): void {
    this.authService.logout();
  }
}
