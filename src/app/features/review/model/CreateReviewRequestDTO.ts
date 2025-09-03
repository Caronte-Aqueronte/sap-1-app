/**
 * Representa la solicitud para crear una reseña
 */
export interface CreateReviewRequestDTO {
  targetId: string;
  rating: number;
  comment?: string;
}
