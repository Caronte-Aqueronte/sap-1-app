import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { Client } from '../../../client/model/Client';
import { ClientService } from '../../../client/service/client-service';
import { CreateClientRequestDTO } from '../../../client/model/CreateClientRequestDTO';
import { Restaurant } from '../../../restaurant/model/Restaurant';
import { RestaurantService } from '../../../restaurant/service/restaurant-service';
import { MenuItem } from '../../../menuItem/model/MenuItem';
import { MenuItemService } from '../../../menuItem/service/menu-item-service';
import { PromotionClientService } from '../../../promotion/service/promotion-client-service';
import { PromotionRestaurantService } from '../../../promotion/service/promotion-restaurant-service';
import { PromotionClient } from '../../../promotion/model/PromotionClient';
import { PromotionRestaurant } from '../../../promotion/model/PromotionRestaurant';
import { NzTableModule } from 'ng-zorro-antd/table';
import { OrderService } from '../../service/order-service';
import { CreateOrderRequestDTO } from '../../model/CreateOrderRequestDTO';

@Component({
  selector: 'app-create-order-dialog',
  standalone: true,
  imports: [
    NzModalModule,
    NzStepsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzInputNumberModule,
    NzDividerModule,
    NzIconModule,
    NzRadioModule,
    ReactiveFormsModule,
    FormsModule,
    NzTableModule,
  ],
  templateUrl: './create-order-dialog.html',
})
export class CreateOrderDialog implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  current = 0;

  // Cliente
  searchForm = this.fb.group({
    nationalId: [
      '',
      [Validators.required, Validators.maxLength(13), Validators.minLength(13)],
    ],
  });
  clientForm = this.fb.group({
    nationalId: [
      '',
      [Validators.required, Validators.maxLength(13), Validators.minLength(13)],
    ],
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(150)],
    ],
    phone: ['', [Validators.required, Validators.maxLength(15)]],
    nit: ['', [Validators.required, Validators.maxLength(15)]],
  });
  client: Client | null = null;
  clientNotFound = false;

  // Restaurante e items
  restaurants: Restaurant[] = [];
  selectedRestaurantId: string | null = null;
  menuItems: MenuItem[] = [];
  itemForm = this.fb.group({
    menuItemId: ['', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });
  cart: Array<{ item: MenuItem; quantity: number; subtotal: number }> = [];
  total = 0;

  // Promociones
  clientPromotions: PromotionClient[] = [];
  restaurantPromotions: PromotionRestaurant[] = [];
  selectedPromotionId: string | null = null;

  constructor(
    private modal: NzModalRef,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private errorRender: ErrorRenderService,
    private clientService: ClientService,
    private restaurantService: RestaurantService,
    private menuItemService: MenuItemService,
    private promotionClientService: PromotionClientService,
    private promotionRestaurantService: PromotionRestaurantService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {}

  /**
   * Busca al cliente con su info de id acional, si no l encunetra entonces marca que no se encontro
   * @returns
   */
  searchClient(): void {
    const nationalId = this.searchForm.value.nationalId;
    //verifica que se haya ingresado un nationalid
    if (!nationalId) {
      this.toastr.warning('Ingrese el número de identificación');
      return;
    }

    this.clientNotFound = false;
    this.client = null;

    //manda a traer al cliente al back
    this.clientService.getClientByNationalId(nationalId).subscribe({
      next: (client: Client) => {
        this.client = client;
        this.cdr.detectChanges();
        this.toastr.success('Hemos encontrado al cliente !');
      },
      error: (err) => {
        //verifica si server respondio con 404 entonces no existe el cliente
        if (err.status === 404) {
          this.clientNotFound = true;
          this.clientForm.patchValue({ nationalId });
          this.toastr.info('Cliente no existe, complete el formulario datos');
          this.cdr.detectChanges();
        } else {
          this.toastr.error(this.errorRender.render(err.error));
        }
      },
    });
  }

  createClient(): void {
    //valida que el formulario esta valido
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.toastr.error('Complete los datos del cliente');
      return;
    }

    //captura los datos del form
    const body: CreateClientRequestDTO =
      this.clientForm.getRawValue() as CreateClientRequestDTO;

    this.clientService.createClient(body).subscribe({
      next: (created: Client) => {
        //selecciona el cliente y cambia la bandera de desconocido
        this.client = created;
        this.clientNotFound = false;

        this.toastr.success('Cliente creado con exito !');
        this.cdr.detectChanges(); //detecta cambios
      },
      error: (err) => this.toastr.error(this.errorRender.render(err.error)),
    });
  }

  /**
   * Carga la lista completa de restaurantes disponibles desde el servicio.
   */
  private loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (restaurants: Restaurant[]) => {
        // asegura que siempre haya un array, aunque la respuesta sea null/undefined
        this.restaurants = restaurants;

        // valida si la lista vino vacía y advierte al usuario
        if (this.restaurants.length === 0) {
          this.toastr.warning('No hay restaurantes disponibles');
        }

        // fuerza la actualización del template
        this.cdr.detectChanges();
      },
      error: (err) => {
        // muestra mensaje de error usando servicio centralizado
        this.toastr.error(this.errorRender.render(err.error));
      },
    });
  }

  /**
   * Maneja el cambio de restaurante seleccionado.
   * @param restaurantId identificador del restaurante seleccionado (null si ninguno)
   */
  onRestaurantChange(restaurantId: string | null): void {
    this.selectedRestaurantId = restaurantId;

    // Reset de estado al cambiar de restaurante
    this.menuItems = [];
    this.cart = [];
    this.total = 0;

    if (!restaurantId) {
      this.toastr.warning('Seleccione un restaurante válido');
      return;
    }

    //hace fetch de los platillos de un restaurante
    this.menuItemService.getAllByRestaurantId(restaurantId).subscribe({
      next: (items: MenuItem[]) => {
        this.menuItems = items;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastr.error(this.errorRender.render(err.error));
      },
    });
  }

  /**
   * Agrega un platillo seleccionado al carrito de la orden.
   */
  addItemToCart(): void {
    // valida que el formulario de item esté correcto
    if (this.itemForm.invalid) {
      this.toastr.error('Completa la información del platillo');
      this.itemForm.markAllAsTouched();
      return;
    }

    // obtiene los valores del formulario (id de platillo y cantidad)
    const { menuItemId, quantity } = this.itemForm.getRawValue();

    // valida que se haya seleccionado un platillo
    if (!menuItemId) {
      this.toastr.error('Debe seleccionar un platillo');
      return;
    }

    // busca el platillo seleccionado en la lista del menú
    const selectedItem = this.menuItems.find(
      (menuItem) => menuItem.id === menuItemId
    );

    if (!selectedItem) {
      this.toastr.error('Platillo no encontrado en el menú');
      return;
    }

    // convierte cantidad a número y calcula subtotal
    const quantityNumber = Number(quantity);
    const subtotal = parseFloat(
      (selectedItem.price * quantityNumber).toFixed(2)
    );

    // inserta el platillo en el carrito con su subtotal
    this.cart = [
      ...this.cart,
      { item: selectedItem, quantity: quantityNumber, subtotal },
    ];

    // recalcula el total del carrito
    this.computeTotal();

    // reinicia el formulario para que quede listo para nuevo ingreso
    this.itemForm.reset({ menuItemId: '', quantity: 1 });

    // fuerza refresco de la vista
    this.cdr.detectChanges();
  }

  removeItem(index: number): void {
    this.cart = this.cart.filter((_, i) => i !== index);
    this.computeTotal();
    this.cdr.detectChanges();
  }

  private computeTotal(): void {
    this.total = this.cart.reduce((acc, it) => acc + it.subtotal, 0);
  }

  /**
   * Carga promociones activas para el cliente y el restaurante seleccionado.
   */
  private loadPromotions(): void {
    // Promociones de cliente
    this.promotionClientService.getActivePromotions().subscribe({
      next: (promotions: PromotionClient[]) => {
        this.clientPromotions = promotions;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastr.error(this.errorRender.render(err.error));
      },
    });

    // Promociones de restaurante
    const restaurantId = this.selectedRestaurantId;
    if (!restaurantId) {
      this.toastr.warning(
        'Debe seleccionar un restaurante para ver promociones'
      );
      return;
    }

    this.promotionRestaurantService
      .getActiveRestaurantPromotionsByRestaurant(restaurantId)
      .subscribe({
        next: (promotions: PromotionRestaurant[]) => {
          this.restaurantPromotions = promotions;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.toastr.error(this.errorRender.render(err.error));
        },
      });
  }

  next(): void {
    if (this.current === 0) {
      if (!this.client) {
        this.toastr.error('Debe seleccionar o crear un cliente');
        return;
      }
      // precarga restaurantes al pasar a paso 2
      this.loadRestaurants();
    } else if (this.current === 1) {
      // Validar restaurante seleccionado antes de continuar a ítems
      if (!this.selectedRestaurantId) {
        this.toastr.error('Seleccione un restaurante');
        return;
      }
    } else if (this.current === 2) {
      // Validar que haya al menos un ítem antes de promociones
      if (this.cart.length === 0) {
        this.toastr.error('Agregue al menos un platillo a la orden');
        return;
      }
      // cargar promociones al entrar a paso 4
      this.loadPromotions();
    }
    this.current += 1;
  }

  pre(): void {
    this.current -= 1;
  }

  /**
   * Construye el payload de orden y emite el resultado.
   * Nota: Integración con backend pendiente. Aquí solo se devuelve el resultado al caller.
   */
  confirmOrder(): void {
    if (!this.client || !this.selectedRestaurantId || this.cart.length === 0) {
      this.toastr.error('Complete los pasos anteriores');
      return;
    }

    const body: CreateOrderRequestDTO = {
      clientId: this.client.id,
      restaurantId: this.selectedRestaurantId,
      items: this.cart.map((c) => ({
        menuItemId: c.item.id,
        quantity: c.quantity,
      })),
      appliedPromotionId:
        this.selectedPromotionId && this.selectedPromotionId.length > 0
          ? this.selectedPromotionId
          : null,
    };

    this.orderService.createOrder(body).subscribe({
      next: (resp) => {
        const blob = new Blob([resp.body as BlobPart], {
          type: 'application/pdf',
        });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');

        this.toastr.success('Orden creada con éxito!');
        this.modal.destroy(true);
      },
      error: (err) => {
        this.toastr.error(this.errorRender.render(err));
      },
    });
  }
}
