import { Component, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { Review } from '../../model/Review';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzRateModule, NzIconModule, FormsModule],
  templateUrl: './review-card.html',
  styleUrl: './review-card.css',
})
export class ReviewCard {
  @Input({ required: true }) review!: Review;
}

