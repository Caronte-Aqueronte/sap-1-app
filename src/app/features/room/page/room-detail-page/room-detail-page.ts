import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { Room } from '../../model/Room';
import { RoomService } from '../../service/room-service';
import { ReviewListSection } from '../../../review/component/review-list-section/review-list-section';
import { ReviewCommentForm } from '../../../review/component/review-comment-form/review-comment-form';
import { ErrorRenderService } from '../../../../core/services/error-render-service';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from '../../../review/service/review-service';
import { CreateReviewRequestDTO } from '../../../review/model/CreateReviewRequestDTO';

@Component({
  selector: 'app-room-detail-page',
  standalone: true,
  imports: [NzPageHeaderModule, ReviewListSection, ReviewCommentForm],
  templateUrl: './room-detail-page.html',
})
export class RoomDetailPage implements OnInit {
  room: Room | null = null;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef,
    private errorRender: ErrorRenderService,
    private toastr: ToastrService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.findRoom();
  }

  private findRoom() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.roomService.getActiveRoomById(id).subscribe({
      next: (room) => {
        this.room = room;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error obteniendo habitación', err),
    });
  }
}
