import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProofTypes } from './business-proof-types';

describe('BusinessProofTypes', () => {
  let component: BusinessProofTypes;
  let fixture: ComponentFixture<BusinessProofTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessProofTypes],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessProofTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
