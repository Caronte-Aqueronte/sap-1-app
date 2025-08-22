import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-login-page',
  imports: [
    RouterOutlet,
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

  // metodo para submit
  login(): void {
    if (this.formLogin.valid) {
      console.log('Datos de login:', this.formLogin.value);
      // aqui va la llamada al backend o servicio de auth
    } else {
      this.formLogin.markAllAsTouched();
    }
  }
}
