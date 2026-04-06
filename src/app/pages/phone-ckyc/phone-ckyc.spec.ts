import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneCkyc } from './phone-ckyc';

describe('PhoneCkyc', () => {
  let component: PhoneCkyc;
  let fixture: ComponentFixture<PhoneCkyc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneCkyc],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneCkyc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
