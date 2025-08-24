import { Establishment } from './Establishment';
import { EstablishmentType } from './EstablishmentType ';

/**
 * entidad que representa un hotel en el sistema
 */
export class Hotel extends Establishment {
  stars: number;

  constructor(
    id: string,
    name: string,
    type: EstablishmentType,
    address: string,
    phoneNumber: string,
    stars: number
  ) {
    super(id, name, type, address, phoneNumber);
    this.stars = stars;
  }
}
