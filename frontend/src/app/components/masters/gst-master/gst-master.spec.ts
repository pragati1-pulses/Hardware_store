import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstMaster } from './gst-master';

describe('GstMaster', () => {
  let component: GstMaster;
  let fixture: ComponentFixture<GstMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GstMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
