/**
 * DTO para la creación de una habitación.
 * Contiene los datos básicos requeridos por el backend.
 * 
 * @author Luis Monterroso
 * @version 1.0
 * @since 2025-08-24
 */
export interface CreateRoomRequestDTO {
  number: string;
  basePrice: number;
  maintenanceCost: number;
}
