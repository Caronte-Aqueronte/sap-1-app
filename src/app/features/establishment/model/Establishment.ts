import { EstablishmentType } from './EstablishmentType ';

/**
 * entidad que representa un establecimiento (hotel o restaurante)
 */
export class Establishment {
  id: string;
  name: string;
  type: EstablishmentType;
  address: string;
  phoneNumber: string;

  constructor(
    id: string,
    name: string,
    type: EstablishmentType,
    address: string,
    phoneNumber: string
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.address = address;
    this.phoneNumber = phoneNumber;
  }
}
