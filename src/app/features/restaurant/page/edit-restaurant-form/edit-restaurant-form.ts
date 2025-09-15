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
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { Hotel } from '../../../hotel/model/Hotel';
import { HotelService } from '../../../hotel/service/hotel-service';
import { SaveRestaurantRequestDTO } from '../../model/CreateRestaurantRequestDTO';
import { Restaurant } from '../../model/Restaurant';
import { RestaurantService } from '../../service/restaurant-service';

@Component({
  selector: 'app-edit-restaurant-form',
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
  templateUrl: './edit-restaurant-form.html',
  styleUrl: './edit-restaurant-form.css',
})
export class EditRestaurantForm implements OnInit {
  rest: Restaurant;

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
    hotelId: this.fb.control<string | null>(null),
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
    private cdr: ChangeDetectorRef,
    @Inject(NZ_MODAL_DATA) public data: { rest: Restaurant }
  ) {
    this.rest = data.rest;
    this.formRestaurant.patchValue(this.rest);
  }

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

        // si el restaurante ya tiene hotel asociado
        if (this.rest.hotel) {
          this.formRestaurant.patchValue({ hotelId: this.rest.hotel.id });
        }

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
      menuItems: null,
    };

    this.restaurantService.editRestaurant(request, this.rest.id).subscribe({
      next: () => {
        this.toastrService.success('Restaurante editado correctamente');
        this.modal.destroy(true); // cierra modal y notifica éxito
      },
      error: (err) => {
        this.toastrService.error(this.errorRenderService.render(err.error));
      },
    });
  }
}
