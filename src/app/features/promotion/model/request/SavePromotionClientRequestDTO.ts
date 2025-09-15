import { SavePromotionRequestDTO } from './SavePromotionRequestDTO';

/**
 * DTO para guardar una promoción orientada a clientes frecuentes.
 */
export interface SavePromotionClientRequestDTO extends SavePromotionRequestDTO {
  minVisits: number;
}

