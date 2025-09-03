import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Hotel } from '../../model/Hotel';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [NzIconModule, NzButtonModule],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.css',
})
export class HotelCard {
  @Input() hotel!: Hotel;
  @Output() explore = new EventEmitter<Hotel>();

  /**
   * Emite el evento de click en
   */
  onExplore() {
    this.explore.emit(this.hotel);
  }
}

