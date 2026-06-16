import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutCustomization } from './checkout-customization';

describe('CheckoutCustomization', () => {
  let component: CheckoutCustomization;
  let fixture: ComponentFixture<CheckoutCustomization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutCustomization],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutCustomization);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
