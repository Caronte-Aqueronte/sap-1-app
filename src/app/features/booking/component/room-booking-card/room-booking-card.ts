import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Room } from '../../../room/model/Room';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-room-booking-card',
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './room-booking-card.html',
  styleUrl: './room-booking-card.css',
})
export class RoomBookingCard {
  @Input() room!: Room; // recibe room
  @Output() reserve = new EventEmitter<Room>(); // emite reservar

  // emite evento reservar
  onReserve(): void {
    this.reserve.emit(this.room);
  }
}
