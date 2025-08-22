import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EyeInvisibleOutline } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
const icons: IconDefinition[] = [EyeInvisibleOutline];

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NzInputModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('sap-1-app');

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
