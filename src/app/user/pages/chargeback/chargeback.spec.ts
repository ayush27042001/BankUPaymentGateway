import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chargeback } from './chargeback';

describe('Chargeback', () => {
  let component: Chargeback;
  let fixture: ComponentFixture<Chargeback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chargeback],
    }).compileComponents();

    fixture = TestBed.createComponent(Chargeback);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
