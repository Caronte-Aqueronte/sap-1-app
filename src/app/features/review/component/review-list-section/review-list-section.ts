import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ReviewService } from '../../service/review-service';
import { Review } from '../../model/Review';
import { ReviewCard } from '../review-card/review-card';

@Component({
  selector: 'app-review-list-section',
  standalone: true,
  imports: [NzDividerModule, ReviewCard],
  templateUrl: './review-list-section.html',
})
export class ReviewListSection implements OnInit, OnChanges {
  @Input() targetId!: string;

  reviews: Review[] = [];

  constructor(
    private reviewService: ReviewService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refresh();
  }
  /**
   * Detecta cambios en las propiedades de entrada
   * si cambia el targetId y no es el primer cambio, vuelve a cargar reseñas
   *
   * @param changes objeto con los cambios detectados en inputs
   */
  ngOnChanges(changes: SimpleChanges): void {
    // si hay cambio en targetId y no es el inicial refresca la lista
    if (changes['targetId'] && !changes['targetId'].firstChange) {
      this.refresh();
    }
  }

  /**
   * Carga la lista de reseñas asociadas al targetId
   * obtiene los datos desde el reviewService
   */
  refresh(): void {
    // si no hay targetId no hace nada
    if (!this.targetId) return;

    this.reviewService.getReviewsByTarget(this.targetId).subscribe({
      next: (reviews: Review[]) => {
        this.reviews = reviews;
        this.cdr.detectChanges(); // fuerza la actualizacion de la vista
      },
      error: (err) => console.error('Error cargando reseñas', err),
    });
  }
}
