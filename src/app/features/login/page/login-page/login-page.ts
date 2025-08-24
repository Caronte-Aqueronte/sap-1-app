import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ToastrService } from 'ngx-toastr';
import { LoginRequestDTO } from '../../../../core/model/login/LoginRequestDTO';
import { LoginResponseDTO } from '../../../../core/model/login/LoginResponseDTO';
import { AuthService } from '../../../../core/services/auth-service';
import { ErrorRenderService } from '../../../../core/services/error-render-service';

@Component({
  selector: 'app-login-page',
  imports: [
    NzInputModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  passwordVisible = false;

  // inyecta el formBuilder
  private fb = inject(NonNullableFormBuilder);

  // definicion del formulario
  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(64)],
    ],
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private errorRenderService: ErrorRenderService
  ) {}

  // metodo para submit
  login(): void {
    if (!this.formLogin.valid) {
      return;
    }

    const body = new LoginRequestDTO(
      this.formLogin.value.email!,
      this.formLogin.value.password!
    );

    this.authService.login(body).subscribe({
      next: (resp: LoginResponseDTO) => {
        //redirige a el dash
        console.log(resp)
        this.redirect(resp.role);
      },
      error: (err) => {
        this.toastr.error(this.errorRenderService.render(err.error));
      },
    });
  }

  /**
   * redirige al usuario segun su rol
   *
   * @param role rol del usuario
   */
  private redirect(role: string) {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/dashboard/admin']);
        break;
      case 'STAFF':
        this.router.navigate(['/dashboard/staff']);
        break;
      default:
        this.toastr.error(
          'No se reconoce tu rol de usuario. Por favor, contacta al área de Administración para obtener acceso.',
          'Acceso no disponible'
        );
        return;
    }
  }
}
