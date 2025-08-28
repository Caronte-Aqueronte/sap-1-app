import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTableModule } from 'ng-zorro-antd/table';
import { RestaurantService } from '../../service/restaurant-service';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { CreateMenuItemRequestDTO } from '../../../menuItem/model/CreateMenuItemRequestDTO';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SaveRestaurantRequestDTO } from '../../model/CreateRestaurantRequestDTO';
import { HotelService } from '../../../hotel/service/hotel-service';
import { Hotel } from '../../../hotel/model/Hotel';
@Component({
  selector: 'app-create-restaurant-form',
  imports: [
    NzButtonModule,
    NzModalModule,
    NzStepsModule,
    NzIconModule,
    NzTableModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzDividerModule,
    NzSelectModule,
  ],
  templateUrl: './create-restaurant-form.html',
  styleUrl: './create-restaurant-form.css',
})
export class CreateRestaurantForm implements OnInit {
  current = 0;

  menu: CreateMenuItemRequestDTO[] = [];

  hotels: Hotel[] = [];
  // inyecta el formBuilder
  private fb = inject(NonNullableFormBuilder);

  // definicion del formulario
  formRestaurant = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    address: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(200)],
    ],
    phoneNumber: ['', [Validators.required, Validators.maxLength(30)]],
    hotelId: [null],
  });

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
    private restaurantService: RestaurantService,
    private hotelService: HotelService,
    private toastrService: ToastrService,
    private errorRenderService: ErrorRenderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  /**
   * Carga la lista de hoteles desde el servicio
   */
  private loadHotels(): void {
    this.hotelService.getAllHotels().subscribe({
      next: (data: Hotel[]) => {
        this.hotels = data;
        this.cdr.detectChanges(); //regresca cambios
      },
      error: (err) => {
        console.error('Error cargando hoteles', err);
      },
    });
  }

  onSubmit() {
    // valida formulario de restaurante
    if (this.formRestaurant.invalid) {
      this.toastrService.error('Completa los datos del restaurante');
      this.formRestaurant.markAllAsTouched();
      return;
    }

    // captura el valor del form
    const formValue = this.formRestaurant.getRawValue();

    // arma el request respetando la interfaz
    const request: SaveRestaurantRequestDTO = {
      name: formValue.name,
      address: formValue.address,
      phoneNumber: formValue.phoneNumber,
      hotelId: formValue.hotelId!,
      menuItems: this.menu,
    };

    this.restaurantService.createRestaurant(request).subscribe({
      next: () => {
        this.toastrService.success('Restaurante creado correctamente');
        this.modal.destroy(true); // cierra modal y notifica éxito
      },
      error: (err) => {
        this.toastrService.error(this.errorRenderService.render(err.error));
      },
    });
  }

  addMenuItem() {
    //si el formulario esta invalido entonces lanzamos error
    if (this.formMenuItem.invalid) {
      this.toastrService.error('Completa los datos del restaurante');
      return;
    }

    //agrega al array la nueva room
    this.menu.push(this.formMenuItem.getRawValue());
    //resetea el formulario
    this.formMenuItem.reset({
      price: 0,
      cost: 0,
    });
  }

  removeMenuItem(index: number) {
    this.menu.splice(index, 1);
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    //evalua que el formulario este valido
    if (this.current === 0 && this.formRestaurant.invalid) {
      this.toastrService.error('Completa los datos del restaurante');
      this.formRestaurant.markAllAsTouched();
      return;
    }
    this.current += 1;
  }
}
