import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { MenuItemService } from '../../service/menu-item-service';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { Restaurant } from '../../../restaurant/model/Restaurant';

@Component({
  selector: 'app-create-menu-item-form',
  imports: [
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
  ],
  templateUrl: './create-menu-item-form.html',
  styleUrl: './create-menu-item-form.css',
})
export class CreateMenuItemForm {
  rest: Restaurant;
  // inyecta el formBuilder
  private fb = inject(NonNullableFormBuilder);
  /**
   * formulario reactivo para crear un item de menu
   */
  formMenuItem = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    cost: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private modal: NzModalRef,
    private menuItemService: MenuItemService,
    private toastrService: ToastrService,
    private errorRenderService: ErrorRenderService,
    private cdr: ChangeDetectorRef,
    @Inject(NZ_MODAL_DATA) public data: { rest: Restaurant }
  ) {
    this.rest = data.rest;
  }

  onSubmit() {
    // valida formulario
    if (this.formMenuItem.invalid) {
      this.toastrService.error('Completa los datos del platillo.');
      this.formMenuItem.markAllAsTouched();
      return;
    }
    // captura valores del form
    const formValue = this.formMenuItem.getRawValue();

    this.menuItemService.createMenuItem(this.rest.id, formValue).subscribe({
      next: () => {
        this.toastrService.success('Platillo creado correctamente');
        this.modal.destroy(true); // cierra modal y notifica éxito
      },
      error: (err) => {
        this.toastrService.error(this.errorRenderService.render(err.error));
      },
    });
  }
}
