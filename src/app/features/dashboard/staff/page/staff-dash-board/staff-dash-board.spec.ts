import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDashBoard } from './staff-dash-board';

describe('StaffDashBoard', () => {
  let component: StaffDashBoard;
  let fixture: ComponentFixture<StaffDashBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffDashBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffDashBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
