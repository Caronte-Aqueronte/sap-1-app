import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { Review } from '../../model/Review';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../client/service/client-service';
import { Client } from '../../../client/model/Client';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzRateModule,
    NzIconModule,
    FormsModule,
  ],
  templateUrl: './review-card.html',
  styleUrl: './review-card.css',
})
export class ReviewCard implements OnInit {
  @Input() review!: Review;
  client!: Client;

  constructor(
    private clientService: ClientService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.review?.clientId) {
      this.loadClient(this.review.clientId);
    }
  }

  private loadClient(clientId: string): void {
    this.clientService.getClientById(clientId).subscribe({
      next: (client: Client) => {
        this.client = client;
        this.cdr.detectChanges();
      },
      error: (err) =>
        console.error(`Error obteniendo cliente con id ${clientId}`, err),
    });
  }
}
