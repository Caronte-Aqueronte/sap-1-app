import { PromotionType } from './PromotionType';

/**
 * Entidad que representa una promoción en el sistema.
 * Solo contiene propiedades (sin métodos).
 */
export interface Promotion {
  id: string;
  name: string;
  discountPercent: number;
  startDateStr: string; // ISO date-time
  endDateStr: string;   // ISO date-time
  isActive: boolean;
  promotionType: PromotionType;
}

