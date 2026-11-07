import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMaster } from './customer-master';

describe('CustomerMaster', () => {
  let component: CustomerMaster;
  let fixture: ComponentFixture<CustomerMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
