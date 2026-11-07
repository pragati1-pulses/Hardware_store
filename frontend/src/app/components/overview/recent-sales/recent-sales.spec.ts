import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentSales } from './recent-sales';

describe('RecentSales', () => {
  let component: RecentSales;
  let fixture: ComponentFixture<RecentSales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentSales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentSales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
