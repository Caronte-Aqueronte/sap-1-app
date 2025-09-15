import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Room } from '../../model/Room';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [NzButtonModule],
  templateUrl: './room-card.html',
})
export class RoomCard {
  @Input() room!: Room;
  @Output() view = new EventEmitter<Room>();

  /**
   * Emite el evento del boton
   */
  onViewDetails() {
    this.view.emit(this.room);
  }
}
