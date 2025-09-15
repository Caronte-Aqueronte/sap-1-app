/**
 * DTO de solicitud para guardar una promoción.
 */
export interface SavePromotionRequestDTO {
  name: string;
  discountPercent: number;
  startDate: string; // ISO date-time
  endDate: string;   // ISO date-time
}

