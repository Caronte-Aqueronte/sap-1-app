import {
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
  OnInit,
} from '@angular/core';
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
import { MenuItem } from '../../model/MenuItem';

@Component({
  selector: 'app-edit-menu-item-form',
  imports: [
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
  ],
  templateUrl: './edit-menu-item-form.html',
  styleUrl: './edit-menu-item-form.css',
})
export class EditMenuItemForm implements OnInit {
  item: MenuItem;

  private fb = inject(NonNullableFormBuilder);

  /**
   * formulario reactivo para editar un item de menu
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
    @Inject(NZ_MODAL_DATA) public data: { item: MenuItem }
  ) {
    this.item = data.item;
    // precarga los valores del item en el form
    this.formMenuItem.patchValue(this.item);
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.formMenuItem.invalid) {
      this.toastrService.error('Completa los datos del platillo.');
      this.formMenuItem.markAllAsTouched();
      return;
    }

    const formValue = this.formMenuItem.getRawValue();

    this.menuItemService.editMenuItem(this.item.id, formValue).subscribe({
      next: () => {
        this.toastrService.success('Platillo editado correctamente');
        this.modal.destroy(true); // cierra modal y notifica éxito
      },
      error: (err) => {
        this.toastrService.error(this.errorRenderService.render(err.error));
      },
    });
  }
}
