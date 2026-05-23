import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessEntityTypes } from './business-entity-types';

describe('BusinessEntityTypes', () => {
  let component: BusinessEntityTypes;
  let fixture: ComponentFixture<BusinessEntityTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessEntityTypes],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessEntityTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
