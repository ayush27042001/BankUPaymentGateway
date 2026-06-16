import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMode } from './payment-mode';

describe('PaymentMode', () => {
  let component: PaymentMode;
  let fixture: ComponentFixture<PaymentMode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMode],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentMode);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
