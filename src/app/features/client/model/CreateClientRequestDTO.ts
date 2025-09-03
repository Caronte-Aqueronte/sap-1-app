/**
 * DTO representa el pipeline de creacion d eun nuevo cliente en el sistema
 */
export interface CreateClientRequestDTO {
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nit: string;
}
