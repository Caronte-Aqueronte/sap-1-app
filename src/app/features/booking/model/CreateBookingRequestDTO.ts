/**
 * DTO de entrada para la creación de reservas.
 * Debe mapear al contrato expuesto por el backend (Java CreateBookingRequestDTO).
 */
export interface CreateBookingRequestDTO {
  clientId: string;
  roomId: string;
  // LocalDate en backend, enviar como 'YYYY-MM-DD'
  checkInAt: string;
  checkOutAt: string;
  // Por ahora siempre null
  appliedPromotionId: string | null;
}

