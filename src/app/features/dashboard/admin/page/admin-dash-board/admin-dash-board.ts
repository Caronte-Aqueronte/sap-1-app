import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from '../../../../../core/services/auth-service';
import { NzButtonModule } from 'ng-zorro-antd/button';

NzButtonModule;
@Component({
  selector: 'app-admin-dash-board',
  imports: [
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    NzButtonModule,
    RouterOutlet,
    RouterLink,
  ],

  templateUrl: './admin-dash-board.html',
  styleUrl: './admin-dash-board.css',
})
export class AdminDashBoard implements OnInit {
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
