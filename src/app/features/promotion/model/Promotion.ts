import { PromotionType } from './PromotionType';

/**
 * Entidad que representa una promoción en el sistema.
 * Solo contiene propiedades (sin métodos).
 */
export interface Promotion {
  id: string;
  name: string;
  discountPercent: number;
  startDate: Date;
  endDate: Date;
  startDateStr: string;
  endDateStr: string;
  isActive: boolean;
  promotionType: PromotionType;
}
