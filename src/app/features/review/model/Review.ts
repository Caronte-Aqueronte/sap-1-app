/**
 * Representa una reseña almacenada en el sistema
 */
export interface Review {
  id: string;
  targetType: string;
  targetId: string;
  clientId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
