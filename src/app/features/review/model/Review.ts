/**
 * Representa una reseña almacenada en el sistema
 */
export interface Review {
  id: string;
  targetType: string;
  targetId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
