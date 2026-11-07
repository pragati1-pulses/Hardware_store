import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankMaster } from './bank-master';

describe('BankMaster', () => {
  let component: BankMaster;
  let fixture: ComponentFixture<BankMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
