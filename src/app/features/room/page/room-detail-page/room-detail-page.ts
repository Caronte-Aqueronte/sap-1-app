import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { Room } from '../../model/Room';
import { RoomService } from '../../service/room-service';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-room-detail-page',
  standalone: true,
  imports: [NzPageHeaderModule, ReactiveFormsModule, NzFormModule],
  templateUrl: './room-detail-page.html',
})
export class RoomDetailPage implements OnInit {
  room: Room | null = null;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.roomService.getActiveRoomById(id).subscribe({
      next: (room) => {
        this.room = room;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error obteniendo habitación', err),
    });
  }
}

