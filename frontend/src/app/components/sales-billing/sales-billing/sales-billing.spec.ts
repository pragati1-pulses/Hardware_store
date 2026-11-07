import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBilling } from './sales-billing';

describe('SalesBilling', () => {
  let component: SalesBilling;
  let fixture: ComponentFixture<SalesBilling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesBilling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBilling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
