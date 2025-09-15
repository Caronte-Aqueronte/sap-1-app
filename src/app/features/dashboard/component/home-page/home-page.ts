import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
})
export class HomePage implements OnInit, OnDestroy {
  logoSrc = '/img/logo.png';
  now = new Date();
  private timer?: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.now = new Date();
      this.cdr.detectChanges();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
