import { Promotion } from './Promotion';

/**
 * Promoción orientada a clientes frecuentes.
 * Extiende de Promotion y agrega el requisito de visitas mínimas.
 */
export interface PromotionClient extends Promotion {
  minVisits: number;
}

