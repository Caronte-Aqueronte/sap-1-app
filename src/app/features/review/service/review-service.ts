import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateReviewRequestDTO } from '../model/CreateReviewRequestDTO';
import { Observable } from 'rxjs';
import { Review } from '../model/Review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private path = environment.apiUrl + '/v1/reviews';

  constructor(private http: HttpClient) {}

  /**
   * Crea una reseña de habitación
   *
   * @param review objeto con la información de la reseña
   * @returns Observable<void> indicando el resultado de la operación
   */
  createRoomReview(review: CreateReviewRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.path}/rooms`, review);
  }

  /**
   * Crea una reseña de restaurante
   *
   * @param review objeto con la información de la reseña
   * @returns Observable<void> indicando el resultado de la operación
   */
  createRestaurantReview(review: CreateReviewRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.path}/restaurants`, review);
  }

  /**
   * Obtiene todas las reseñas asociadas a un target específico
   *
   * @param targetId identificador único del recurso reseñado
   * @returns Observable<Review[]> con la lista de reseñas
   */
  getReviewsByTarget(targetId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.path}/by-target/${targetId}`);
  }
}
